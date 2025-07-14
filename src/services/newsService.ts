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
    return this.getDemoNews().slice(0, limit);
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
        id: '7',
        title: "Why agri-food systems policy in the EAC must embrace its youth to empower the next generation",
        excerpt: "The agri-food systems value chain remains the backbone of the East African Community’s economies, yet youth engagement is critical to sustain its future.",
        content: "In this Opinion piece, published by African Agribusiness, the author argues that engaging youth in EAC's agri-food systems policy is crucial to empowering the next generation of farmers and sustaining economic growth in the region.",
        author: "Staff Writer",
        publishedDate: "2025-05-02T00:00:00.000Z",
        imageUrl: "/public/7.png",
        category: "Opinion",
        tags: ["policy","youth","agrifood-systems","EAC"],
        source: "African Agribusiness",
        url: "https://africanagribusiness.com/country/rwanda/"
      },
      {
        id: '8',
        title: "Rwanda expands farmland and boosts food production in 2025 agricultural season",
        excerpt: "Cultivated land rose by 3.9%, driving a 3.6% increase in food output for Season A 2025.",
        content: "The 2025 Seasonal Agricultural Survey reports that Rwanda’s cultivated land grew to 1.483 million ha, up from 1.428 million ha the previous year, resulting in higher maize, bean, and potato yields.",
        author: "Editorial Team",
        publishedDate: "2025-06-03T00:00:00.000Z",
        imageUrl: "/public/8.png",
        category: "Agriculture",
        tags: ["farmland-expansion","food-security","SAS2025","crop-yields"],
        source: "Kigali Times",
        url: "https://www.kigalitimes.rw/2025/06/03/rwanda-expands-farmland-and-boosts-food-production-in-2025-agricultural-season/"
      },
      {
        id: '9',
        title: "Rwanda launches Fifth Strategic Plan for Agriculture Transformation (PSTA 5)",
        excerpt: "PSTA 5 sets forth inclusive, stakeholder-driven priorities to guide Rwanda’s agricultural growth through 2029.",
        content: "The Ministry of Agriculture and Animal Resources unveiled PSTA 5 after extensive consultations, aiming to boost productivity, resilience, and market competitiveness across all districts.",
        author: "Ministry of Agriculture",
        publishedDate: "2024-12-06T00:00:00.000Z",
        imageUrl: "/public/9.png",
        category: "Government",
        tags: ["strategic-plan","PSTA5","policy","stakeholder-consultation"],
        source: "MINAGRI",
        url: "https://www.minagri.gov.rw/updates/news-details/rwanda-launches-5th-strategic-plan-for-agriculture-transformation"
      },
      {
        id: '10',
        title: "Rwanda’s agriculture sector transformation journey over the last 29 years",
        excerpt: "Agriculture’s share of GDP has shifted alongside dramatic poverty reduction and rural livelihoods improvements.",
        content: "This retrospective from MINAGRI highlights how sector reforms and investments have propelled agriculture to account for 25% of GDP while reducing rural poverty rates.",
        author: "MINAGRI Communications",
        publishedDate: "2025-07-01T00:00:00.000Z",
        imageUrl: "/public/10.png",
        category: "Analysis",
        tags: ["sector-transformation","economic-growth","poverty-reduction","GDP"],
        source: "MINAGRI",
        url: "https://www.minagri.gov.rw/updates/news-details/rwandas-agriculture-sector-transformation-journey-over-the-last-29-years"
      },
      {
        id: '11',
        title: "Rwanda’s agriculture report reveals mixed trends, opportunities",
        excerpt: "While irrigation and sustainable practices advance, input adoption and yield gaps persist.",
        content: "According to the 2024 Seasonal Agricultural Survey by NISR, gains in irrigation contrast with slower uptake of improved seeds and fertilizers, threatening long-term productivity.",
        author: "KT Press Staff",
        publishedDate: "2025-01-15T00:00:00.000Z",
        imageUrl: "/public/11.png",
        category: "Research",
        tags: ["survey","irrigation","sustainability","productivity"],
        source: "KT Press",
        url: "https://www.ktpress.rw/2025/01/rwandas-agriculture-report-reveals-mixed-trends-in-productivity-and-sustainability/"
      },
      {
        id: '13',
        title: "Rwanda introduces Climate-Smart Agriculture Investment Plan",
        excerpt: "A 449.7 billion FRW initiative to scale water management, soil health, and resilient crops on 83,250 ha.",
        content: "The Rwanda Green Fund and IFC unveiled this CSA plan to mobilize private investment in sustainable practices, targeting irrigation, post-harvest loss reduction, and livestock resilience.",
        author: "Atinuke Ajeniyi",
        publishedDate: "2025-06-20T00:00:00.000Z",
        imageUrl: "/public/13.png",
        category: "Investment",
        tags: ["Climate-Smart","investment","IFC","Green-Fund"],
        source: "AgroCentric",
        url: "https://agrocentric.com/2025/06/20/rwanda-introduce-new-plan-to-attract-over-335-million-for-climate-smart-farming/"
      },
      {
        id: '14',
        title: "Rwanda presents five key investment opportunities in agriculture worth $785 million",
        excerpt: "Under FAO’s Hand in Hand Initiative, cattle restocking and feed mills top the list.",
        content: "Hon. Ildephonse Musafiri outlined sites for agri-hubs and facilities—slaughterhouses, feed mills, hides processing—to attract investors into Rwanda’s value chains.",
        author: "Jean Pierre Mazimpaka",
        publishedDate: "2024-10-15T00:00:00.000Z",
        imageUrl: "/public/14.png",
        category: "Investment",
        tags: ["FAO","Hand-in-Hand","investment-opportunities","agribusiness"],
        source: "MINAGRI",
        url: "https://www.minagri.gov.rw/updates/news-details/rwanda-presents-five-key-investment-opportunities-in-agriculture-worth-785-million"
      },
      {
        id: '15',
        title: "FAO launches Fostering Digital Villages project in Rwanda",
        excerpt: "Digital ambassadors and IoT tools to empower smallholder farmers across rural districts.",
        content: "This initiative equips youth and farmer groups with mobile platforms for real-time data and weather forecasts, enhancing decision-making on inputs and irrigation.",
        author: "FAO Rwanda",
        publishedDate: "2024-11-14T00:00:00.000Z",
        imageUrl: "/public/15.png",
        category: "Technology",
        tags: ["IoT","digital-villages","FAO","smallholders"],
        source: "FAO",
        url: "https://www.fao.org/rwanda/en/"
      },
      {
        id: '16',
        title: "From vision to action: Building Rwanda’s agrifood systems transformation through policymaker training",
        excerpt: "A July 2025 workshop strengthened capacities to design the 2025–2030 Strategic Plan.",
        content: "The Training for Policymakers workshop aligned stakeholders around PSTA 6, focusing on stakeholder analysis, monitoring frameworks, and resource mobilization.",
        author: "FAO Food Systems",
        publishedDate: "2025-07-03T00:00:00.000Z",
        imageUrl: "/public/16.png",
        category: "Capacity Building",
        tags: ["workshop","policymaker-training","agrifood-systems","PSTA6"],
        source: "FAO",
        url: "https://www.fao.org/food-systems/news/news-detail/from-vision-to-action--helping-to-build-rwanda-s-agrifood-systems-transformation-through-policymaker-training/"
      },
      {
        id: '17',
        title: "Promoting Green Rwanda through urban farming at the FAO Rwanda office",
        excerpt: "Over 1,500 plants across four hydroponic systems showcase sustainable urban agriculture.",
        content: "In partnership with Eza Neza, this vertical farm in Kigali demonstrates lettuce, strawberries, and cauliflower production using hydroponics and solar power.",
        author: "Coumba Sow",
        publishedDate: "2025-03-24T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Urban Farming",
        tags: ["hydroponics","vertical-farm","urban-agriculture","sustainability"],
        source: "FAO Food for Cities",
        url: "https://www.fao.org/in-action/food-for-cities-programme/news/detail/en/c/1735177/"
      },
      {
        id: '18',
        title: "FEATURED: Rwanda, FAO collaborate to mitigate methane emissions in agriculture and livestock",
        excerpt: "The “Foster Methane Mitigation” project targets feed management and waste systems in livestock farms.",
        content: "Launched February 2025, this FAO-backed initiative works with cooperatives to pilot feed additives and biogas digesters to curb methane from enteric fermentation and manure.",
        author: "Frank Ntarindwa",
        publishedDate: "2025-02-19T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/723349/pexels-photo-723349.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Climate Action",
        tags: ["methane-mitigation","livestock","FAO","climate-smart"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/24183/news/featured/featured-rwanda-fao-collaborate-to-mitigate-methane-emissions-in-agriculture-livestock-sectors"
      },
      {
        id: '19',
        title: "Rwanda strengthens fight against antimicrobial resistance with FAO support",
        excerpt: "A multisectoral NAP revision addresses human, animal, and plant health to curb AMR threats.",
        content: "Supported by FAO and international partners, Rwanda’s updated National Action Plan integrates surveillance, stewardship, and One Health strategies across sectors.",
        author: "FutureMediaNews",
        publishedDate: "2025-05-19T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/270293/pexels-photo-270293.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Health",
        tags: ["AMR","One-Health","FAO","policy"],
        source: "FutureMediaNews",
        url: "https://futuremedianews.com.na/2025/05/19/rwanda-strengthens-fight-against-antimicrobial-resistance-with-food-and-agriculture-organization-of-the-united-nations-fao-support/"
      },
      {
        id: '20',
        title: "Agricultural output set to increase by 10% in 2025: What will drive growth?",
        excerpt: "RAB projects a 10% output rise in Season A 2025, led by seed multiplication and greenhouse programs.",
        content: "Factors include improved seed distribution, greenhouse seed multiplication in Musanze, and expanded extension services to remote farmers.",
        author: "New Times Staff",
        publishedDate: "2024-08-22T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Forecast",
        tags: ["output-projection","seed-multiplication","greenhouses","extension-services"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/19423/news/agriculture/agricultural-output-set-to-increase-by-10-in-2025-what-will-drive-growth"
      },
      {
        id: '21',
        title: "Rwandan farmers list seven issues hurting staple crops",
        excerpt: "Farmers cite high input costs, erratic weather, and market access as top challenges.",
        content: "A nationwide survey revealed concerns over fertilizer affordability, drought risk, and gaps in storage and transport infrastructure.",
        author: "New Times Staff",
        publishedDate: "2025-06-15T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/887962/pexels-photo-887962.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Farmer Voices",
        tags: ["challenges","staple-crops","input-costs","market-access"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/19423/news/agriculture/rwandan-farmers-list-seven-issues-hurting-staple-crops"
      },
      {
        id: '22',
        title: "Farmers crack under pressure as macadamia prices plunge",
        excerpt: "Price volatility leaves macadamia growers facing losses amid export uncertainties.",
        content: "Growers report that sudden export bans and global oversupply have halved farm-gate prices, threatening local processing investments.",
        author: "New Times Staff",
        publishedDate: "2025-06-13T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/275285/pexels-photo-275285.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Markets",
        tags: ["macadamia","price-volatility","exports","value-chain"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/19423/news/agriculture/farmers-crack-under-pressure-as-macadamia-prices-plunge"
      },
      {
        id: '23',
        title: "New hope for Rwandan farmers as drone delivery of cow semen begins",
        excerpt: "Drone-based AI logistics bring reproductive material to remote herders within hours.",
        content: "The pilot in Nyamasheke District uses GPS-guided drones to deliver high-quality semen, reducing reliance on cold-chain trucks.",
        author: "New Times Staff",
        publishedDate: "2025-06-11T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/302353/pexels-photo-302353.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Innovation",
        tags: ["drone","livestock-genetics","AI","remote-farming"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/19423/news/agriculture/new-hope-for-rwandan-farmers-as-drone-delivery-of-cow-semen-begins"
      },
      {
        id: '24',
        title: "Ngirente: Africa must leverage tech, innovation to develop agriculture",
        excerpt: "Rwanda’s PM calls for pan-African collaboration on agri-tech and data-driven tools.",
        content: "In a keynote address at the Kigali AgriTech Summit, Prime Minister Ngirente highlighted mobile apps, satellite mapping, and AI as game-changers.",
        author: "New Times Staff",
        publishedDate: "2025-06-10T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/103652/pexels-photo-103652.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Speeches",
        tags: ["technology","innovation","policy","summit"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/19423/news/agriculture/ngirente-africa-must-leverage-tech-innovation-to-develop-agriculture"
      },
      {
        id: '25',
        title: "Experts: Digital solutions developers must prioritize farmers’ needs",
        excerpt: "Tech developers urged to co-design apps with end users for greater adoption.",
        content: "Panelists at the Digital AgriForum recommended user-centric design and offline functionality to meet rural connectivity constraints.",
        author: "New Times Staff",
        publishedDate: "2025-06-10T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/459558/pexels-photo-459558.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Technology",
        tags: ["agri-tech","user-centric","digital-solutions","forum"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/19423/news/agriculture/experts-digital-solutions-developers-must-prioritize-farmers-needs"
      },
      {
        id: '26',
        title: "Major agric meet in Kigali discusses improving farmers’ access to technologies",
        excerpt: "Stakeholders review barriers to adoption and plan extension-tech partnerships.",
        content: "Representatives from government, private sector, and NGOs outlined roadmaps for digital extension services and co-operatives to scale new tools.",
        author: "New Times Staff",
        publishedDate: "2025-06-10T00:00:00.000Z",
        imageUrl: "https://images.pexels.com/photos/459156/pexels-photo-459156.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Events",
        tags: ["conference","extension-services","public-private","technology-access"],
        source: "The New Times",
        url: "https://www.newtimes.co.rw/article/19423/news/agriculture/major-agric-meet-in-kigali-discusses-improving-farmers-access-to-technologies"
      }
    ];
  }
}

export const newsService = new NewsService();