/**
 * News Service - Aggregates Bitcoin/crypto news from multiple sources
 * Sources: NewsAPI.org (general news) + CryptoPanic (crypto-specific)
 * Search terms are configurable via crypto-news-terms.json
 */

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  category: 'news' | 'analysis' | 'regulation';
}

interface CryptoNewsConfig {
  searchTerms: string[];
  excludeTerms: string[];
}

// Using NewsAPI.org free tier - requires API key
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo';
const NEWS_API_BASE = 'https://newsapi.org/v2';

// CryptoPanic - Free tier, no API key required for basic usage
const CRYPTOPANIC_BASE = 'https://cryptopanic.com/api/v1';
const CRYPTOPANIC_KEY = import.meta.env.VITE_CRYPTOPANIC_API_KEY || 'free';

// Load search terms from config
let newsConfig: CryptoNewsConfig = {
  searchTerms: ['Bitcoin', 'BTC', 'cryptocurrency'],
  excludeTerms: []
};

let configLoaded = false;
let configLoadPromise: Promise<void> | null = null;
let lastConfigLoad = 0;
const CONFIG_RELOAD_INTERVAL = 5 * 60 * 1000; // Reload config every 5 minutes

/**
 * Load crypto news search terms from configuration file
 */
async function loadNewsConfig(): Promise<void> {
  try {
    const response = await fetch('/crypto-news-terms.json');
    if (response.ok) {
      const config = await response.json();
      newsConfig = {
        searchTerms: config.searchTerms || newsConfig.searchTerms,
        excludeTerms: config.excludeTerms || []
      };
      console.log('✓ Loaded Bitcoin news config:');
      console.log('  - Search terms:', newsConfig.searchTerms.length, 'terms');
      console.log('  - Exclude terms:', newsConfig.excludeTerms.length, 'terms');
      configLoaded = true;
      lastConfigLoad = Date.now();
    }
  } catch (error) {
    console.warn('⚠️ Failed to load crypto-news-terms.json, using defaults:', error);
    console.log('  - Default search terms:', newsConfig.searchTerms);
    configLoaded = true;
    lastConfigLoad = Date.now();
  }
}

/**
 * Ensure config is loaded before using it
 */
async function ensureConfigLoaded(): Promise<void> {
  // Reload config periodically or if never loaded
  const shouldReload = !configLoaded || (Date.now() - lastConfigLoad > CONFIG_RELOAD_INTERVAL);
  
  if (shouldReload || !configLoadPromise) {
    configLoadPromise = loadNewsConfig();
  }
  await configLoadPromise;
}

/**
 * Build search query from configured terms with Bitcoin focus
 */
function buildSearchQuery(): string {
  // Prioritize Bitcoin-specific terms with better logic
  const bitcoinTerms = ['Bitcoin', 'BTC'];
  const contextTerms = ['price', 'market', 'ETF', 'mining', 'halving', 'adoption', 'regulation'];
  
  // Primary query focuses on Bitcoin with context
  const primaryQuery = `(Bitcoin OR BTC) AND (${contextTerms.join(' OR ')})`;
  return primaryQuery;
}

/**
 * Fetch Bitcoin news from NewsAPI
 */
async function fetchNewsAPIArticles(): Promise<NewsArticle[]> {
  try {
    // Ensure config is loaded before building query
    await ensureConfigLoaded();
    
    const searchQuery = buildSearchQuery();
    console.log('🔍 NewsAPI search query:', searchQuery);
    
    // Skip NewsAPI if using demo key (won't work)
    if (NEWS_API_KEY === 'demo') {
      console.log('⚠️ NewsAPI demo key detected, skipping NewsAPI fetch');
      return [];
    }
    
    const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(searchQuery)}&sortBy=publishedAt&pageSize=25&language=en&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`NewsAPI error ${response.status}: ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    
    if (data.status === 'error') {
      console.warn('NewsAPI error:', data.message);
      return [];
    }
    
    console.log(`✓ NewsAPI returned ${data.articles?.length || 0} articles`);
    
    const articles = data.articles?.map((article: any, index: number) => ({
      id: `newsapi-${index}-${Date.now()}`,
      title: article.title,
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt,
      url: article.url,
      category: categorizeNews(article.title)
    })) || [];
    
    // Debug: Log relevance scores
    console.log('📊 Article relevance scores:');
    articles.forEach(article => {
      const score = scoreBitcoinRelevance(article);
      console.log(`  ${score}/100: ${article.title.slice(0, 60)}...`);
    });
    
    // Filter out excluded terms and low-relevance articles
    const filtered = filterExcludedTerms(articles);
    console.log(`✓ After filtering: ${filtered.length} articles (excluded ${articles.length - filtered.length})`);
    return filtered;
  } catch (error) {
    console.warn('Failed to fetch from NewsAPI:', error);
    return [];
  }
}

/**
 * Score article relevance to Bitcoin (0-100)
 */
function scoreBitcoinRelevance(article: NewsArticle): number {
  const title = article.title.toLowerCase();
  const source = article.source.toLowerCase();
  let score = 0;
  
  // Primary Bitcoin indicators (high weight)
  if (title.includes('bitcoin') || title.includes('btc')) score += 40;
  
  // Bitcoin-specific context terms (medium weight)
  const bitcoinContext = ['satoshi', 'lightning', 'halving', 'mining', 'wallet', 'node'];
  bitcoinContext.forEach(term => {
    if (title.includes(term)) score += 15;
  });
  
  // Market/financial context with Bitcoin (medium weight)
  if ((title.includes('bitcoin') || title.includes('btc')) && 
      (title.includes('price') || title.includes('market') || title.includes('etf') || title.includes('trading'))) {
    score += 20;
  }
  
  // Crypto-focused sources (small boost)
  const cryptoSources = ['coindesk', 'cointelegraph', 'bitcoinist', 'cryptonews', 'cryptopanic', 'decrypt'];
  if (cryptoSources.some(s => source.includes(s))) score += 10;
  
  // Penalties for non-Bitcoin focus
  const altcoinTerms = ['ethereum', 'eth', 'altcoin', 'solana', 'cardano', 'polygon', 'avalanche', 'nft'];
  altcoinTerms.forEach(term => {
    if (title.includes(term) && !title.includes('bitcoin') && !title.includes('btc')) {
      score -= 20;
    }
  });
  
  // Penalty for too generic crypto mentions
  if (title.includes('cryptocurrency') && !title.includes('bitcoin') && !title.includes('btc')) {
    score -= 10;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Filter out articles containing excluded terms and low Bitcoin relevance
 */
function filterExcludedTerms(articles: NewsArticle[]): NewsArticle[] {
  const filtered = articles.filter(article => {
    const titleLower = article.title.toLowerCase();
    
    // Check excluded terms
    const hasExcludedTerms = newsConfig.excludeTerms.some(term => 
      titleLower.includes(term.toLowerCase())
    );
    if (hasExcludedTerms) return false;
    
    // Check Bitcoin relevance score
    const relevanceScore = scoreBitcoinRelevance(article);
    return relevanceScore >= 30; // Minimum relevance threshold
  });
  
  // Sort by relevance score (highest first)
  return filtered.sort((a, b) => scoreBitcoinRelevance(b) - scoreBitcoinRelevance(a));
}

/**
 * Fetch crypto news from CryptoPanic
 */
async function fetchCryptoPanicArticles(): Promise<NewsArticle[]> {
  try {
    // Use more specific parameters for Bitcoin-focused content
    const url = `${CRYPTOPANIC_BASE}/posts/?auth_token=${CRYPTOPANIC_KEY}&currencies=BTC&kind=news&filter=hot&regions=en&metadata=true`;
    console.log('🔍 Fetching from CryptoPanic with BTC focus');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CryptoPanic error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.results?.slice(0, 10).map((post: any) => ({
      id: `cryptopanic-${post.id}`,
      title: post.title,
      source: post.source?.title || 'CryptoPanic',
      publishedAt: post.published_at,
      url: post.url,
      category: categorizeNews(post.title)
    })) || [];
  } catch (error) {
    console.warn('Failed to fetch from CryptoPanic:', error);
    return [];
  }
}

/**
 * Categorize news based on title keywords
 */
function categorizeNews(title: string): 'news' | 'analysis' | 'regulation' {
  const lower = title.toLowerCase();
  
  if (lower.includes('sec') || lower.includes('regulation') || lower.includes('law') || 
      lower.includes('government') || lower.includes('etf') || lower.includes('legal')) {
    return 'regulation';
  }
  
  if (lower.includes('analysis') || lower.includes('forecast') || lower.includes('prediction') ||
      lower.includes('outlook') || lower.includes('technical')) {
    return 'analysis';
  }
  
  return 'news';
}

/**
 * Get relative time string (e.g., "10 mins ago")
 */
function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Fetch aggregated Bitcoin news from multiple sources
 * @param limit - Number of articles to return (default: 5)
 * @param offset - Number of articles to skip for pagination (default: 0)
 */
export async function fetchBitcoinNews(limit: number = 5, offset: number = 0): Promise<NewsArticle[]> {
  try {
    // Ensure config is loaded first (will reload periodically)
    await ensureConfigLoaded();
    
    console.log('📰 Fetching Bitcoin news from multiple sources...');
    console.log('🎯 Current Bitcoin focus filters:', {
      searchTerms: newsConfig.searchTerms.slice(0, 5),
      excludeTerms: newsConfig.excludeTerms,
      minRelevanceScore: 25,
      limit,
      offset
    });
    
    // Fetch from both sources in parallel
    const [newsApiArticles, cryptoPanicArticles] = await Promise.all([
      fetchNewsAPIArticles(),
      fetchCryptoPanicArticles()
    ]);
    
    console.log(`📊 Results: ${newsApiArticles.length} from NewsAPI, ${cryptoPanicArticles.length} from CryptoPanic`);
    
    // Combine and deduplicate by title similarity
    const allArticles = [...cryptoPanicArticles, ...newsApiArticles];
    const uniqueArticles = deduplicateArticles(allArticles);
    
    // Apply final relevance filtering and scoring
    const relevantArticles = uniqueArticles.filter(article => {
      const score = scoreBitcoinRelevance(article);
      console.log(`📈 Final relevance check: ${score}/100 - ${article.title.slice(0, 50)}...`);
      return score >= 25; // Lower threshold for final selection to allow more variety
    });
    
    console.log(`✓ Total relevant articles after final filtering: ${relevantArticles.length}`);
    
    // Sort by relevance score first, then by date
    const sortedArticles = relevantArticles
      .sort((a, b) => {
        const scoreA = scoreBitcoinRelevance(a);
        const scoreB = scoreBitcoinRelevance(b);
        if (scoreB !== scoreA) return scoreB - scoreA; // Higher score first
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(); // Then newer first
      });
    
    // Apply pagination
    const finalArticles = sortedArticles.slice(offset, offset + limit);
      
    if (finalArticles.length === 0 && offset === 0) {
      console.warn('⚠️ No articles fetched, using mock data');
      return getMockNews();
    }
    
    console.log(`✅ Returning ${finalArticles.length} articles (offset: ${offset}, limit: ${limit})`);
    finalArticles.forEach(a => console.log(`  - ${a.title.slice(0, 60)}...`));
    
    return finalArticles;
  } catch (error) {
    console.error('❌ Failed to fetch Bitcoin news:', error);
    console.log('📝 Using mock news as fallback');
    return getMockNews(); // Fallback to mock data
  }
}

/**
 * Deduplicate articles based on title similarity
 */
function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    const titleKey = article.title.toLowerCase().slice(0, 50);
    if (seen.has(titleKey)) return false;
    seen.add(titleKey);
    return true;
  });
}

/**
 * Debug function: Test Bitcoin relevance scoring
 * Call this in console: window.debugBitcoinNews(['Bitcoin price hits $100k', 'Ethereum update'])
 */
export function debugBitcoinRelevance(titles: string[]): void {
  console.log('🔍 Debug: Testing Bitcoin relevance scoring');
  titles.forEach(title => {
    const mockArticle: NewsArticle = {
      id: 'debug',
      title,
      source: 'Test',
      publishedAt: new Date().toISOString(),
      url: '#',
      category: 'news'
    };
    const score = scoreBitcoinRelevance(mockArticle);
    console.log(`${score}/100: ${title}`);
  });
}

/**
 * Format article for display
 */
export function formatNewsArticle(article: NewsArticle) {
  return {
    ...article,
    timeAgo: getRelativeTime(article.publishedAt),
    categoryLabel: article.category.charAt(0).toUpperCase() + article.category.slice(1)
  };
}

/**
 * Mock news data for fallback - Bitcoin focused
 */
function getMockNews(): NewsArticle[] {
  const now = Date.now();
  return [
    {
      id: 'mock-1',
      title: 'Bitcoin ETF sees record $2.3B inflows as institutional adoption accelerates',
      source: 'Bloomberg',
      publishedAt: new Date(now - 600000).toISOString(),
      url: '#',
      category: 'news'
    },
    {
      id: 'mock-2',
      title: 'SEC approves additional Bitcoin ETF options trading amid growing demand',
      source: 'Reuters',
      publishedAt: new Date(now - 1800000).toISOString(),
      url: '#',
      category: 'regulation'
    },
    {
      id: 'mock-3',
      title: 'Bitcoin network hash rate reaches new all-time high ahead of 2028 halving',
      source: 'CoinDesk',
      publishedAt: new Date(now - 3600000).toISOString(),
      url: '#',
      category: 'analysis'
    },
    {
      id: 'mock-4',
      title: 'MicroStrategy acquires additional 15,000 Bitcoin in Q4 treasury update',
      source: 'Bitcoin Magazine',
      publishedAt: new Date(now - 5400000).toISOString(),
      url: '#',
      category: 'news'
    },
    {
      id: 'mock-5',
      title: 'Lightning Network capacity surpasses 5,000 BTC milestone',
      source: 'Decrypt',
      publishedAt: new Date(now - 7200000).toISOString(),
      url: '#',
      category: 'analysis'
    }
  ];
}

// Expose debug function globally for console testing
if (typeof window !== 'undefined') {
  (window as any).debugBitcoinNews = debugBitcoinRelevance;
}
