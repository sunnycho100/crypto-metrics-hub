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
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      try {
        const articles = await fetchBitcoinNews();
        if (mounted) {
          setNewsArticles(articles);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNews();

    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);

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

  const pulseItems: PulseItem[] = newsArticles.map(article => {
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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const articles = await fetchBitcoinNews();
      setNewsArticles(articles);
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex-1 relative z-0">
      <div className="p-4 lg:px-6 border-b border-slate-200 dark:border-[#3b4754] flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Market Pulse</h3>
        <IconButton icon="refresh" onClick={handleRefresh} disabled={loading} />
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
