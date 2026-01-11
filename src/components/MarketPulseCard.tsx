import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { IconButton } from './Button';
import { fetchBitcoinNews, formatNewsArticle, type NewsArticle } from '../services/news';

interface PulseItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  time: string;
  category: string;
  url?: string;
}

export const MarketPulseCard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [newsCache, setNewsCache] = useState<Map<number, NewsArticle[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const ARTICLES_PER_PAGE = 5;

  // Fetch initial news on mount
  useEffect(() => {
    let mounted = true;

    const fetchInitialNews = async () => {
      setLoading(true);
      try {
        const articles = await fetchBitcoinNews(ARTICLES_PER_PAGE, 0);
        if (mounted) {
          setNewsCache(new Map([[0, articles]]));
        }
      } catch (error) {
        console.error('Error fetching initial news:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchInitialNews();

    // Refresh news every 5 minutes (refresh page 0)
    const interval = setInterval(() => {
      fetchBitcoinNews(ARTICLES_PER_PAGE, 0).then(articles => {
        setNewsCache(prev => {
          const newCache = new Map(prev);
          newCache.set(0, articles);
          return newCache;
        });
      });
    }, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'regulation':
        return { icon: 'gavel', iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' };
      case 'analysis':
        return { icon: 'psychology', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-500' };
      default:
        return { icon: 'newspaper', iconBg: 'bg-green-500/10', iconColor: 'text-green-500' };
    }
  };

  const currentNewsArticles = newsCache.get(currentPage) || [];
  const pulseItems: PulseItem[] = currentNewsArticles.map(article => {
    const formatted = formatNewsArticle(article);
    const iconData = getCategoryIcon(article.category);
    
    return {
      ...iconData,
      title: article.title,
      time: formatted.timeAgo,
      category: `${formatted.categoryLabel} • ${article.source}`,
      url: article.url
    };
  });

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    
    // Check if we already have this page cached
    if (newsCache.has(nextPage)) {
      setCurrentPage(nextPage);
    } else {
      // Fetch next page of articles
      setLoading(true);
      try {
        const offset = nextPage * ARTICLES_PER_PAGE;
        const articles = await fetchBitcoinNews(ARTICLES_PER_PAGE, offset);
        
        if (articles.length > 0) {
          setNewsCache(prev => new Map(prev).set(nextPage, articles));
          setCurrentPage(nextPage);
        } else {
          console.log('No more articles available');
        }
      } catch (error) {
        console.error('Error fetching next page:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const hasNextPage = newsCache.has(currentPage + 1) || currentPage === 0;
  const hasPrevPage = currentPage > 0;

  return (
    <Card className="flex-1 relative z-0">
      <div className="p-4 lg:px-6 border-b border-slate-200 dark:border-[#3b4754] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Market Pulse</h3>
          {currentPage > 0 && (
            <span className="text-xs text-text-secondary">
              Page {currentPage + 1}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <IconButton 
            icon="chevron_left" 
            onClick={handlePrevPage} 
            disabled={!hasPrevPage}
            aria-label="Previous news page"
          />
          <IconButton 
            icon="chevron_right" 
            onClick={handleNextPage} 
            disabled={loading}
            aria-label="Next news page"
          />
        </div>
      </div>
      
      {loading && pulseItems.length === 0 ? (
        <div className="p-8 text-center text-text-secondary">
          <span className="material-symbols-outlined text-4xl mb-2 block">hourglass_empty</span>
          Loading news...
        </div>
      ) : pulseItems.length === 0 ? (
        <div className="p-8 text-center text-text-secondary">
          <span className="material-symbols-outlined text-4xl mb-2 block">error_outline</span>
          No news available
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-200 dark:divide-[#3b4754]">
          {pulseItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-[#202933]/50 transition-colors cursor-pointer no-underline"
            >
              <div className={`h-10 w-10 shrink-0 rounded ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">{item.title}</p>
                <p className="text-xs text-text-secondary">{item.time} • {item.category}</p>
              </div>
            </a>
          ))}
        </div>
      )}
      
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-[#3b4754]">
        <p className="text-xs text-center text-text-secondary">
          Sources: CryptoPanic & NewsAPI
        </p>
      </div>
    </Card>
  );
};
