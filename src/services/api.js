import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'https://newsapi.org/v2'; // Replace with your news API
const API_KEY = '7832e0edab2d4bb8936ab87605a4e608'; // Replace with your actual API key

// Demo mode for testing without API key
const DEMO_MODE = API_KEY === 'your-api-key-here';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  params: {
    apiKey: API_KEY
  }
});

// Demo news data for testing
const demoNewsData = {
  status: 'ok',
  totalResults: 3,
  articles: [
    {
      title: "Demo News Article 1 - Tech Innovation",
      description: "This is a demo article about the latest technology innovations. In demo mode, we're showing sample data instead of real API calls.",
      url: "https://example.com/article1",
      urlToImage: "https://via.placeholder.com/300x200?text=Tech+News",
      publishedAt: new Date().toISOString(),
      source: { name: "Demo News Source" }
    },
    {
      title: "Demo News Article 2 - Global Events",
      description: "This is another demo article about global events. This demonstrates how the news feed will look with real data.",
      url: "https://example.com/article2",
      urlToImage: "https://via.placeholder.com/300x200?text=World+News",
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      source: { name: "Demo World News" }
    },
    {
      title: "Demo News Article 3 - Sports Update",
      description: "This is a demo sports article. Once you add your API key, real news articles will replace these demo entries.",
      url: "https://example.com/article3",
      urlToImage: "https://via.placeholder.com/300x200?text=Sports+News",
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      source: { name: "Demo Sports Network" }
    }
  ]
};

// News API functions
export const fetchNews = async (category = 'general', country = 'us', pageSize = 50, from = null, to = null) => {
  try {
    // If in demo mode, return demo data
    if (DEMO_MODE) {
      console.log('🔄 Running in DEMO mode - using sample data');
      console.log('To use real news data, get an API key from https://newsapi.org/');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return demoNewsData;
    }

    const params = {
      category,
      country,
      pageSize: Math.min(pageSize, 100) // NewsAPI max is 100
    };

    // Add date parameters if provided
    if (from) {
      params.from = from;
    }
    if (to) {
      params.to = to;
    }

    const response = await api.get('/top-headlines', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to demo data if API fails
    console.log('🔄 API failed, falling back to demo data');
    return demoNewsData;
  }
};

// Enhanced search with date support
export const searchNewsWithDates = async (query, page = 1, pageSize = 20, from = null, to = null, sortBy = 'publishedAt') => {
  try {
    // If in demo mode, return filtered demo data
    if (DEMO_MODE) {
      console.log('🔄 Running in DEMO mode - searching in sample data');
      const filteredArticles = demoNewsData.articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        ...demoNewsData,
        articles: filteredArticles,
        totalResults: filteredArticles.length
      };
    }

    const params = {
      q: query,
      page,
      pageSize: Math.min(pageSize, 100),
      sortBy // 'relevancy', 'popularity', 'publishedAt'
    };

    // Add date parameters if provided
    if (from) {
      params.from = from;
    }
    if (to) {
      params.to = to;
    }

    const response = await api.get('/everything', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching news with dates:', error);
    
    // Fallback to demo data
    console.log('🔄 API failed, falling back to demo data');
    return demoNewsData;
  }
};

export const searchNews = async (query, page = 1) => {
  try {
    // If in demo mode, return filtered demo data
    if (DEMO_MODE) {
      console.log('🔄 Running in DEMO mode - searching in sample data');
      const filteredArticles = demoNewsData.articles.filter(article =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        ...demoNewsData,
        articles: filteredArticles,
        totalResults: filteredArticles.length
      };
    }

    const response = await api.get('/everything', {
      params: {
        q: query,
        page,
        pageSize: 20
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching news:', error);
    
    // Fallback to demo data
    console.log('🔄 API failed, falling back to demo data');
    return demoNewsData;
  }
};

export const fetchNewsBySource = async (sources) => {
  try {
    // If in demo mode, return demo data
    if (DEMO_MODE) {
      console.log('🔄 Running in DEMO mode - returning sample source data');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 900));
      return demoNewsData;
    }

    const response = await api.get('/top-headlines', {
      params: {
        sources
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news by source:', error);
    
    // Fallback to demo data
    console.log('🔄 API failed, falling back to demo data');
    return demoNewsData;
  }
};

export default api;