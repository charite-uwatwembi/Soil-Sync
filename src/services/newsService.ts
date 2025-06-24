import { supabase } from '../lib/supabase';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  publishedDate: string;
  imageUrl: string;
  category: string;
  tags: string[];
  source: string;
  url: string;
}

class NewsService {
  // Get latest news articles
  async getLatestNews(limit: number = 20, category?: string): Promise<NewsArticle[]> {
    try {
      // Try to get from Supabase Edge Function first
      const { data, error } = await supabase.functions.invoke('news-feed', {
        body: { limit, category }
      });

      if (error) {
        console.error('News feed error:', error);
        return this.getDemoNews().slice(0, limit);
      }

      return data.articles.map(this.transformNewsArticle);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return this.getDemoNews().slice(0, limit);
    }
  }

  // Get news by category
  async getNewsByCategory(category: string, limit: number = 10): Promise<NewsArticle[]> {
    return this.getLatestNews(limit, category);
  }

  // Search news articles
  async searchNews(query: string, limit: number = 10): Promise<NewsArticle[]> {
    const allNews = await this.getLatestNews(50);
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return allNews
      .filter(article => {
        const searchText = `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase();
        return searchTerms.some(term => searchText.includes(term));
      })
      .slice(0, limit);
  }

  // Get trending topics
  async getTrendingTopics(): Promise<string[]> {
    const news = await this.getLatestNews(50);
    const tagCounts: Record<string, number> = {};

    news.forEach(article => {
      article.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  // Cache news articles locally
  async cacheNews(articles: NewsArticle[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('news_articles')
        .upsert(articles.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          author: article.author,
          published_date: article.publishedDate,
          image_url: article.imageUrl,
          category: article.category,
          tags: article.tags,
          source: article.source,
          url: article.url
        })));

      if (error) {
        console.error('Failed to cache news:', error);
      }
    } catch (error) {
      console.error('News caching error:', error);
    }
  }

  // Get cached news (fallback)
  async getCachedNews(limit: number = 20): Promise<NewsArticle[]> {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_date', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data.map(this.transformDbNewsArticle);
    } catch (error) {
      console.error('Failed to get cached news:', error);
      return this.getDemoNews().slice(0, limit);
    }
  }

  private transformNewsArticle = (article: any): NewsArticle => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    publishedDate: article.published_date,
    imageUrl: article.image_url,
    category: article.category,
    tags: article.tags || [],
    source: article.source,
    url: article.url
  });

  private transformDbNewsArticle = (article: any): NewsArticle => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    publishedDate: article.published_date,
    imageUrl: article.image_url,
    category: article.category,
    tags: article.tags || [],
    source: article.source,
    url: article.url
  });

  private getDemoNews(): NewsArticle[] {
    return [
      {
        id: '1',
        title: "Rwanda's Smart Agriculture Initiative Shows Promising Results",
        excerpt: "New data reveals significant yield improvements across participating farms using precision agriculture techniques and AI-powered recommendations.",
        content: "The Government of Rwanda's smart agriculture initiative has shown remarkable progress in its first year of implementation. Farmers using precision agriculture techniques, including soil analysis and AI-powered fertilizer recommendations, have reported yield increases of up to 30% compared to traditional farming methods. The initiative, which combines IoT sensors, machine learning algorithms, and mobile technology, has reached over 10,000 farmers across all 30 districts of Rwanda.",
        author: "Ministry of Agriculture",
        publishedDate: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Government",
        tags: ["smart-agriculture", "rwanda", "technology", "yields"],
        source: "Ministry of Agriculture",
        url: "#"
      },
      {
        id: '2',
        title: "Soil Health Monitoring: Best Practices for Rwandan Farmers",
        excerpt: "Expert recommendations on maintaining optimal soil conditions for sustainable crop production in Rwanda's diverse agricultural zones.",
        content: "Soil health is fundamental to sustainable agriculture in Rwanda. This comprehensive guide provides farmers with practical strategies for monitoring and improving soil conditions, including proper fertilizer application, crop rotation, and organic matter management. The Rwanda Agriculture Board emphasizes the importance of regular soil testing and precision agriculture techniques.",
        author: "Rwanda Agriculture Board",
        publishedDate: new Date(Date.now() - 172800000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Education",
        tags: ["soil-health", "farming", "sustainability", "best-practices"],
        source: "Rwanda Agriculture Board",
        url: "#"
      },
      {
        id: '3',
        title: "Climate-Smart Fertilizer Application Techniques",
        excerpt: "How precision fertilizer application is helping farmers adapt to changing weather patterns and optimize crop yields.",
        content: "Climate change presents new challenges for farmers worldwide. This article explores innovative fertilizer application techniques that help farmers adapt to variable weather conditions while maintaining high crop yields and environmental sustainability. Research shows that precision application can reduce fertilizer use by 20% while increasing yields by 15%.",
        author: "CGIAR Research",
        publishedDate: new Date(Date.now() - 259200000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Research",
        tags: ["climate-smart", "fertilizer", "adaptation", "precision-agriculture"],
        source: "CGIAR Research",
        url: "#"
      },
      {
        id: '4',
        title: "Digital Agriculture Tools Transform Rural Communities",
        excerpt: "Mobile technology and AI-powered recommendations are revolutionizing farming practices across East Africa.",
        content: "The adoption of digital agriculture tools is transforming rural communities across East Africa. From SMS-based soil analysis to drone monitoring, technology is making precision agriculture accessible to smallholder farmers. Mobile platforms now serve over 500,000 farmers in the region, providing real-time advice and market information.",
        author: "Tech4Agriculture",
        publishedDate: new Date(Date.now() - 345600000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Technology",
        tags: ["digital-agriculture", "mobile", "innovation", "east-africa"],
        source: "Tech4Agriculture",
        url: "#"
      },
      {
        id: '5',
        title: "Sustainable Farming Practices Boost Crop Yields in Rwanda",
        excerpt: "Local farmers report significant improvements in productivity through adoption of sustainable agricultural methods.",
        content: "Sustainable farming practices are proving their worth in Rwanda, with farmers reporting both increased yields and improved soil health. These methods include integrated pest management, crop diversification, and efficient water use. The Rwanda Farmers Federation reports that sustainable practices have led to 25% higher incomes for participating farmers.",
        author: "Rwanda Farmers Federation",
        publishedDate: new Date(Date.now() - 432000000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Sustainability",
        tags: ["sustainable-farming", "productivity", "environment", "income"],
        source: "Rwanda Farmers Federation",
        url: "#"
      },
      {
        id: '6',
        title: "IoT Sensors Revolutionize Crop Monitoring in Rwanda",
        excerpt: "Internet of Things technology enables real-time monitoring of soil conditions and crop health across Rwandan farms.",
        content: "IoT sensors are transforming agriculture in Rwanda by providing real-time data on soil moisture, temperature, and nutrient levels. This technology enables farmers to make data-driven decisions about irrigation, fertilization, and pest control. Early adopters report 30% water savings and 20% increase in crop yields.",
        author: "Rwanda ICT Chamber",
        publishedDate: new Date(Date.now() - 518400000).toISOString(),
        imageUrl: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Technology",
        tags: ["iot", "sensors", "monitoring", "data-driven"],
        source: "Rwanda ICT Chamber",
        url: "#"
      }
    ];
  }
}

export const newsService = new NewsService();