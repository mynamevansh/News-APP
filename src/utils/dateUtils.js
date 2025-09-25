// Date utility functions for filtering and sorting news articles

export const getDateRange = (filterType, customStart = null, customEnd = null) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (filterType) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
      
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return {
        start: yesterday,
        end: today
      };
      
    case 'week':
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start: oneWeekAgo,
        end: now
      };
      
    case 'month':
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return {
        start: oneMonthAgo,
        end: now
      };
      
    case 'custom':
      return {
        start: customStart ? new Date(customStart) : null,
        end: customEnd ? new Date(customEnd + 'T23:59:59') : null
      };
      
    default: // 'all'
      return {
        start: null,
        end: null
      };
  }
};

export const filterArticlesByDate = (articles, dateFilter, customStartDate = null, customEndDate = null) => {
  if (dateFilter === 'all') {
    return articles;
  }
  
  const { start, end } = getDateRange(dateFilter, customStartDate, customEndDate);
  
  if (!start || !end) {
    return articles;
  }
  
  return articles.filter(article => {
    const articleDate = new Date(article.publishedAt);
    return articleDate >= start && articleDate <= end;
  });
};

export const sortArticlesByDate = (articles, sortOrder) => {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    
    if (sortOrder === 'oldest') {
      return dateA - dateB; // Oldest first
    } else {
      return dateB - dateA; // Newest first (default)
    }
  });
};

export const paginateArticles = (articles, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    articles: articles.slice(startIndex, endIndex),
    totalItems: articles.length,
    totalPages: Math.ceil(articles.length / itemsPerPage),
    currentPage,
    itemsPerPage
  };
};

export const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

export const getFilterStats = (allArticles, filteredArticles, dateFilter) => {
  const totalArticles = allArticles.length;
  const filteredCount = filteredArticles.length;
  const filterPercentage = totalArticles > 0 ? Math.round((filteredCount / totalArticles) * 100) : 0;
  
  let filterDescription = '';
  switch (dateFilter) {
    case 'today':
      filterDescription = 'from today';
      break;
    case 'yesterday':
      filterDescription = 'from yesterday';
      break;
    case 'week':
      filterDescription = 'from past week';
      break;
    case 'month':
      filterDescription = 'from past month';
      break;
    case 'custom':
      filterDescription = 'from custom range';
      break;
    default:
      filterDescription = 'total';
  }
  
  return {
    totalArticles,
    filteredCount,
    filterPercentage,
    filterDescription
  };
};