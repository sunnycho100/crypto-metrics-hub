/**
 * News Service - Aggregates Bitcoin/crypto news from multiple sources
 * Sources: NewsAPI.org (general news) + CryptoPanic (crypto-specific)
 */

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  category: 'news' | 'analysis' | 'regulation';
}

// Using NewsAPI.org free tier - requires API key
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo';
const NEWS_API_BASE = 'https://newsapi.org/v2';

// CryptoPanic - Free tier, no API key required for basic usage
const CRYPTOPANIC_BASE = 'https://cryptopanic.com/api/v1';
const CRYPTOPANIC_KEY = import.meta.env.VITE_CRYPTOPANIC_API_KEY || 'free';

/**
 * Fetch Bitcoin news from NewsAPI
 */
async function fetchNewsAPIArticles(): Promise<NewsArticle[]> {
  try {
    const url = `${NEWS_API_BASE}/everything?q=bitcoin&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.articles?.slice(0, 3).map((article: any, index: number) => ({
      id: `newsapi-${index}-${Date.now()}`,
      title: article.title,
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt,
      url: article.url,
      category: categorizeNews(article.title)
    })) || [];
  } catch (error) {
    console.warn('Failed to fetch from NewsAPI:', error);
    return [];
  }
}

/**
 * Fetch crypto news from CryptoPanic
 */
async function fetchCryptoPanicArticles(): Promise<NewsArticle[]> {
  try {
    const url = `${CRYPTOPANIC_BASE}/posts/?auth_token=${CRYPTOPANIC_KEY}&currencies=BTC&kind=news&filter=hot`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CryptoPanic error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.results?.slice(0, 3).map((post: any) => ({
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
 */
export async function fetchBitcoinNews(): Promise<NewsArticle[]> {
  try {
    // Fetch from both sources in parallel
    const [newsApiArticles, cryptoPanicArticles] = await Promise.all([
      fetchNewsAPIArticles(),
      fetchCryptoPanicArticles()
    ]);
    
    // Combine and deduplicate by title similarity
    const allArticles = [...cryptoPanicArticles, ...newsApiArticles];
    const uniqueArticles = deduplicateArticles(allArticles);
    
    // Sort by date (newest first) and return top 5
    return uniqueArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
  } catch (error) {
    console.error('Failed to fetch Bitcoin news:', error);
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
 * Mock news data for fallback
 */
function getMockNews(): NewsArticle[] {
  return [
    {
      id: 'mock-1',
      title: 'Bitcoin ETF sees record inflows as institutional interest grows',
      source: 'Bloomberg',
      publishedAt: new Date(Date.now() - 600000).toISOString(),
      url: '#',
      category: 'news'
    },
    {
      id: 'mock-2',
      title: 'SEC delays decision on Bitcoin ETF options trading',
      source: 'Reuters',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      url: '#',
      category: 'regulation'
    },
    {
      id: 'mock-3',
      title: 'Technical analysis: Bitcoin tests key support at $60,000',
      source: 'CoinDesk',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      url: '#',
      category: 'analysis'
    }
  ];
}
