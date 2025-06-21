import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, User, Search, Filter, RefreshCw } from 'lucide-react';
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
    const searchText = `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Agricultural News</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Latest insights from Rwanda and beyond
          </p>
        </div>
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
          <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1">
            <span>View All</span>
            <ExternalLink className="h-4 w-4" />
          </button>
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
      <div className="space-y-4 max-h-96 overflow-y-auto">
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
              className={`group cursor-pointer transition-all duration-200 hover:scale-105 ${
                isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              } p-4 rounded-lg`}
            >
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                    {article.title}
                  </h4>
                  <p className={`text-xs mt-1 line-clamp-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {article.excerpt}
                  </p>
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.category === 'Government' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                      article.category === 'Research' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                      article.category === 'Technology' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {article.category}
                    </span>
                  </div>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
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