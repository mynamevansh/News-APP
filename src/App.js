import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchNews } from './services/api';
import votingService from './services/votingService';
import preferencesService from './services/preferencesService';
import { filterArticlesByDate, sortArticlesByDate, paginateArticles, getFilterStats, formatDateForDisplay } from './utils/dateUtils';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import VotingButtons from './components/VotingButtons';
import Pagination from './components/Pagination';
import DateFilter from './components/DateFilter';
import UserProfile from './components/auth/UserProfile';
import AuthModal from './components/auth/AuthModal';

function NewsApp() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // State for news data
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRealData, setIsRealData] = useState(false);
  
  // State for voting
  const [votingStats, setVotingStats] = useState({ totalArticles: 0, totalVotes: 0, userTotalVotes: 0 });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // State for date filtering and sorting
  const [dateFilter, setDateFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // State for authentication modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Processed data
  const [processedNews, setProcessedNews] = useState([]);
  const [paginatedNews, setPaginatedNews] = useState({
    articles: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  });

  // Load user preferences when authentication state changes
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const preferences = await preferencesService.getPreferences();
        
        if (preferences.pagination) {
          setItemsPerPage(preferences.pagination.itemsPerPage || 10);
          setCurrentPage(preferences.pagination.currentPage || 1);
        }
        
        if (preferences.filters) {
          setDateFilter(preferences.filters.dateFilter || 'all');
          setSortOrder(preferences.filters.sortOrder || 'newest');
          setCustomStartDate(preferences.filters.customStartDate || '');
          setCustomEndDate(preferences.filters.customEndDate || '');
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    };

    if (!authLoading) {
      loadUserPreferences();
    }
  }, [isAuthenticated, authLoading]);

  // Sync local data when user logs in
  useEffect(() => {
    const syncUserData = async () => {
      if (isAuthenticated && user) {
        try {
          // Sync voting data
          await votingService.syncLocalVotesToBackend();
          
          // Sync preferences
          await preferencesService.syncLocalPreferencesToBackend();
          
          console.log('User data synced successfully');
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      }
    };

    if (isAuthenticated && !authLoading) {
      syncUserData();
    }
  }, [isAuthenticated, user, authLoading]);

  // Load news articles
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        // Fetch more articles (100 for better filtering options)
        const newsData = await fetchNews('general', 'us', 100);
        setAllNews(newsData.articles || []);
        
        // Check if we're getting real data
        const hasRealData = newsData.articles && newsData.articles.some(article => 
          article.source?.name !== 'Demo News Source' && 
          article.source?.name !== 'Demo World News' && 
          article.source?.name !== 'Demo Sports Network'
        );
        setIsRealData(hasRealData);
        
      } catch (err) {
        setError('Failed to fetch news');
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // Process articles: filter by date, sort, add voting data, and paginate
  useEffect(() => {
    const processArticles = async () => {
      if (allNews.length > 0) {
        try {
          // 1. Filter by date
          const filteredNews = filterArticlesByDate(allNews, dateFilter, customStartDate, customEndDate);
          
          // 2. Sort by date
          const sortedByDate = sortArticlesByDate(filteredNews, sortOrder);
          
          // 3. Add voting data and sort by votes
          const newsWithVotes = await votingService.sortArticlesByVotes(sortedByDate);
          
          // 4. Set processed news
          setProcessedNews(newsWithVotes);
          
          // 5. Reset to first page when filters change
          setCurrentPage(1);
          
          // 6. Update voting stats
          const stats = await votingService.getStats();
          setVotingStats(stats);
        } catch (error) {
          console.error('Error processing articles:', error);
          setProcessedNews(allNews);
        }
      }
    };

    processArticles();
  }, [allNews, dateFilter, sortOrder, customStartDate, customEndDate]);

  // Paginate processed news
  useEffect(() => {
    const paginated = paginateArticles(processedNews, currentPage, itemsPerPage);
    setPaginatedNews(paginated);
  }, [processedNews, currentPage, itemsPerPage]);

  // Save preferences when they change
  useEffect(() => {
    const savePreferences = async () => {
      if (!authLoading) {
        await preferencesService.setPaginationPreferences({
          itemsPerPage,
          currentPage
        });
      }
    };

    savePreferences();
  }, [itemsPerPage, currentPage, authLoading]);

  useEffect(() => {
    const saveFilterPreferences = async () => {
      if (!authLoading) {
        await preferencesService.setFilterPreferences({
          dateFilter,
          sortOrder,
          customStartDate,
          customEndDate
        });
      }
    };

    saveFilterPreferences();
  }, [dateFilter, sortOrder, customStartDate, customEndDate, authLoading]);

  // Handle voting
  const handleVote = async (article, voteType, result) => {
    try {
      // Update the processed news list with new vote data
      const updatedNews = processedNews.map(item => {
        if (item._voting.id === article._voting.id) {
          return {
            ...item,
            _voting: {
              ...item._voting,
              upvotes: result.upvotes,
              downvotes: result.downvotes,
              score: result.score,
              userVote: result.userVote
            }
          };
        }
        return item;
      }).sort((a, b) => b._voting.score - a._voting.score);
      
      setProcessedNews(updatedNews);
      
      // Update voting stats
      const stats = await votingService.getStats();
      setVotingStats(stats);
    } catch (error) {
      console.error('Error updating vote:', error);
    }
  };

  // Handle pagination changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Handle date filter changes
  const handleDateFilterChange = (newFilter) => {
    setDateFilter(newFilter);
  };

  const handleSortOrderChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleCustomDateChange = (type, value) => {
    if (type === 'start') {
      setCustomStartDate(value);
    } else {
      setCustomEndDate(value);
    }
  };

  // Get filter statistics
  const filterStats = getFilterStats(allNews, processedNews, dateFilter);

  if (loading || authLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner-large"></div>
        <p>Loading news...</p>
      </div>
    );
  }
  
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      {!isRealData && (
        <div className="demo-indicator">
          🔄 DEMO MODE - Using sample data. Check console for API errors.
        </div>
      )}
      {isRealData && (
        <div className="real-data-indicator">
          ✅ LIVE NEWS - Powered by NewsAPI.org
        </div>
      )}
      
      <header className="App-header">
        <div className="header-content">
          <div>
            <h1>Enhanced News App</h1>
            <p>With Authentication, Voting, Pagination & Date Filtering</p>
          </div>
          
          <div className="header-auth">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <button 
                className="sign-in-button"
                onClick={() => setShowAuthModal(true)}
              >
                <span>🔐</span>
                Sign In
              </button>
            )}
          </div>
        </div>
        
        <div className="stats-bar">
          <span>📰 {filterStats.filteredCount} Articles {filterStats.filterDescription}</span>
          <span>🗳️ {votingStats.totalVotes} Total Votes</span>
          {isAuthenticated && <span>👤 You voted {votingStats.userTotalVotes} times</span>}
          <span>📊 {filterStats.filterPercentage}% of total shown</span>
          {isAuthenticated && <span>✅ Signed in as {user.name.split(' ')[0]}</span>}
        </div>
      </header>

      {/* Date Filter Controls */}
      <DateFilter
        dateFilter={dateFilter}
        sortOrder={sortOrder}
        onDateFilterChange={handleDateFilterChange}
        onSortOrderChange={handleSortOrderChange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomDateChange={handleCustomDateChange}
      />

      {/* Pagination Top */}
      <Pagination
        currentPage={paginatedNews.currentPage}
        totalItems={paginatedNews.totalItems}
        itemsPerPage={paginatedNews.itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      <main className="news-container">
        {paginatedNews.articles.length > 0 ? (
          paginatedNews.articles.map((article, index) => {
            const globalRank = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <article key={article._voting.id} className="news-article">
                <div className="article-rank">#{globalRank}</div>
                {article.urlToImage && (
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="article-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="article-content">
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  
                  <VotingButtons 
                    article={article}
                    onVote={handleVote}
                  />
                  
                  <div className="article-meta">
                    <span>Source: {article.source?.name}</span>
                    <span>{formatDateForDisplay(article.publishedAt)}</span>
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                  </a>
                </div>
              </article>
            );
          })
        ) : (
          <div className="no-articles">
            <h3>No articles found</h3>
            <p>Try adjusting your date filters or check back later for more news.</p>
          </div>
        )}
      </main>

      {/* Pagination Bottom */}
      <Pagination
        currentPage={paginatedNews.currentPage}
        totalItems={paginatedNews.totalItems}
        itemsPerPage={paginatedNews.itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to enhance your experience"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NewsApp />
    </AuthProvider>
  );
}

export default App;
