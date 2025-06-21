import { corsHeaders } from '../_shared/cors.ts';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_date: string;
  image_url: string;
  category: string;
  tags: string[];
  source: string;
  url: string;
}

// News aggregation service
class NewsService {
  private newsAPIs: Array<{
    name: string;
    url: string;
    apiKey?: string;
    transform: (data: any) => NewsArticle[];
  }>;

  constructor() {
    this.newsAPIs = [
      {
        name: 'Rwanda Agriculture Board',
        url: 'https://api.rab.gov.rw/news',
        transform: this.transformRABNews
      },
      {
        name: 'CGIAR Research',
        url: 'https://api.cgiar.org/news',
        transform: this.transformCGIARNews
      },
      {
        name: 'AgriProFocus',
        url: 'https://api.agriprofocus.com/news',
        transform: this.transformAgriProFocusNews
      }
    ];
  }

  async getLatestNews(limit: number = 20): Promise<NewsArticle[]> {
    const allNews: NewsArticle[] = [];

    // Fetch from multiple sources
    for (const api of this.newsAPIs) {
      try {
        const response = await fetch(api.url, {
          headers: api.apiKey ? { 'Authorization': `Bearer ${api.apiKey}` } : {}
        });
        
        if (response.ok) {
          const data = await response.json();
          const transformedNews = api.transform(data);
          allNews.push(...transformedNews);
        }
      } catch (error) {
        console.error(`Error fetching from ${api.name}:`, error);
      }
    }

    // Add fallback news if no external sources available
    if (allNews.length === 0) {
      allNews.push(...this.getFallbackNews());
    }

    // Sort by date and limit
    return allNews
      .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
      .slice(0, limit);
  }

  private transformRABNews(data: any): NewsArticle[] {
    return (data.articles || []).map((article: any) => ({
      id: article.id || crypto.randomUUID(),
      title: article.title,
      excerpt: article.summary || article.excerpt,
      content: article.content,
      author: article.author || 'Rwanda Agriculture Board',
      published_date: article.published_date || article.date,
      image_url: article.image_url || 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Agriculture',
      tags: article.tags || ['agriculture', 'rwanda'],
      source: 'Rwanda Agriculture Board',
      url: article.url || '#'
    }));
  }

  private transformCGIARNews(data: any): NewsArticle[] {
    return (data.news || []).map((article: any) => ({
      id: article.id || crypto.randomUUID(),
      title: article.title,
      excerpt: article.description,
      content: article.body,
      author: article.author || 'CGIAR Research',
      published_date: article.date,
      image_url: article.featured_image || 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Research',
      tags: article.keywords || ['research', 'agriculture'],
      source: 'CGIAR Research',
      url: article.link || '#'
    }));
  }

  private transformAgriProFocusNews(data: any): NewsArticle[] {
    return (data.items || []).map((article: any) => ({
      id: article.id || crypto.randomUUID(),
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author || 'AgriProFocus',
      published_date: article.published,
      image_url: article.image || 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Industry',
      tags: article.tags || ['agribusiness', 'africa'],
      source: 'AgriProFocus',
      url: article.url || '#'
    }));
  }

  private getFallbackNews(): NewsArticle[] {
    return [
      {
        id: '1',
        title: "Rwanda's Smart Agriculture Initiative Shows Promising Results",
        excerpt: "New data reveals significant yield improvements across participating farms using precision agriculture techniques and AI-powered recommendations.",
        content: "The Government of Rwanda's smart agriculture initiative has shown remarkable progress in its first year of implementation. Farmers using precision agriculture techniques, including soil analysis and AI-powered fertilizer recommendations, have reported yield increases of up to 30% compared to traditional farming methods.",
        author: "Ministry of Agriculture",
        published_date: new Date(Date.now() - 86400000).toISOString(),
        image_url: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Government",
        tags: ["smart-agriculture", "rwanda", "technology"],
        source: "Ministry of Agriculture",
        url: "#"
      },
      {
        id: '2',
        title: "Soil Health Monitoring: Best Practices for Rwandan Farmers",
        excerpt: "Expert recommendations on maintaining optimal soil conditions for sustainable crop production in Rwanda's diverse agricultural zones.",
        content: "Soil health is fundamental to sustainable agriculture. This comprehensive guide provides Rwandan farmers with practical strategies for monitoring and improving soil conditions, including proper fertilizer application, crop rotation, and organic matter management.",
        author: "Rwanda Agriculture Board",
        published_date: new Date(Date.now() - 172800000).toISOString(),
        image_url: "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Education",
        tags: ["soil-health", "farming", "sustainability"],
        source: "Rwanda Agriculture Board",
        url: "#"
      },
      {
        id: '3',
        title: "Climate-Smart Fertilizer Application Techniques",
        excerpt: "How precision fertilizer application is helping farmers adapt to changing weather patterns and optimize crop yields.",
        content: "Climate change presents new challenges for farmers worldwide. This article explores innovative fertilizer application techniques that help farmers adapt to variable weather conditions while maintaining high crop yields and environmental sustainability.",
        author: "CGIAR Research",
        published_date: new Date(Date.now() - 259200000).toISOString(),
        image_url: "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Research",
        tags: ["climate-smart", "fertilizer", "adaptation"],
        source: "CGIAR Research",
        url: "#"
      },
      {
        id: '4',
        title: "Digital Agriculture Tools Transform Rural Communities",
        excerpt: "Mobile technology and AI-powered recommendations are revolutionizing farming practices across East Africa.",
        content: "The adoption of digital agriculture tools is transforming rural communities across East Africa. From SMS-based soil analysis to drone monitoring, technology is making precision agriculture accessible to smallholder farmers.",
        author: "Tech4Agriculture",
        published_date: new Date(Date.now() - 345600000).toISOString(),
        image_url: "https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Technology",
        tags: ["digital-agriculture", "mobile", "innovation"],
        source: "Tech4Agriculture",
        url: "#"
      },
      {
        id: '5',
        title: "Sustainable Farming Practices Boost Crop Yields in Rwanda",
        excerpt: "Local farmers report significant improvements in productivity through adoption of sustainable agricultural methods.",
        content: "Sustainable farming practices are proving their worth in Rwanda, with farmers reporting both increased yields and improved soil health. These methods include integrated pest management, crop diversification, and efficient water use.",
        author: "Rwanda Farmers Federation",
        published_date: new Date(Date.now() - 432000000).toISOString(),
        image_url: "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Sustainability",
        tags: ["sustainable-farming", "productivity", "environment"],
        source: "Rwanda Farmers Federation",
        url: "#"
      }
    ];
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const category = url.searchParams.get('category');

    const newsService = new NewsService();
    let news = await newsService.getLatestNews(limit);

    // Filter by category if specified
    if (category) {
      news = news.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }

    return new Response(
      JSON.stringify({ articles: news, total: news.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('News feed error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});