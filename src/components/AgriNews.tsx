import { Calendar, Filter, RefreshCw, Search, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { newsService, type NewsArticle } from '../services/newsService';

interface AgriNewsProps {
  isDarkMode: boolean;
}

const AgriNews: React.FC<AgriNewsProps> = ({ isDarkMode }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'government', label: 'Government' },
    { value: 'research', label: 'Research' },
    { value: 'technology', label: 'Technology' },
    { value: 'sustainability', label: 'Sustainability' },
    { value: 'education', label: 'Education' }
  ];

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await newsService.getLatestNews(
        10, 
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setArticles(newsData);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNews();
    setIsRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadNews();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await newsService.searchNews(searchTerm);
      setArticles(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    if (!searchTerm) return true;
    const articleTitle = article.title || '';
    const articleExcerpt = article.excerpt || '';
    const articleTags = (article.tags && Array.isArray(article.tags)) ? article.tags.join(' ') : '';
    const searchText = `${articleTitle} ${articleExcerpt} ${articleTags}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {articles.length} articles found
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 space-y-3">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search news..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-1 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`animate-pulse p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex space-x-4">
                  <div className={`w-16 h-16 rounded-lg ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 rounded ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}></div>
                    <div className={`h-3 rounded w-3/4 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div
              key={article.id}
              className={`group cursor-pointer bg-cover bg-center rounded-xl overflow-hidden shadow hover:shadow-lg transition-transform hover:-translate-y-1 relative`} 
              style={{ backgroundImage: `url(${article.imageUrl})` }}
              onClick={() => {
                if (article.url && article.url !== '#') {
                  window.open(article.url, '_blank', 'noopener,noreferrer');
                } else {
                  setSelectedArticle(article);
                }
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Content */}
              <div className="relative flex flex-col justify-end h-48 p-4">
                <h4 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-green-300 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center justify-between mt-2 text-[10px] text-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-1">
                  <span className={`px-2 py-[2px] rounded-full text-[10px] font-medium backdrop-blur bg-white/20 text-white`}>{article.category}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Search className={`h-12 w-12 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm ? 'No articles found for your search.' : 'No articles available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgriNews;