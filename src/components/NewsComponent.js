import React, { useState, useEffect } from 'react';
import { fetchNews, searchNews } from '../services/api';

const NewsComponent = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch initial news on component mount
  useEffect(() => {
    loadTopHeadlines();
  }, []);

  const loadTopHeadlines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews();
      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to fetch news');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await searchNews(searchTerm);
      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to search news');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="news-component">
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <label htmlFor="news-search" className="sr-only">Search for news</label>
          <input
            type="text"
            id="news-search"
            name="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for news..."
            className="search-input"
            aria-label="Search for news articles"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        <button onClick={loadTopHeadlines} className="reset-button">
          Show Top Headlines
        </button>
      </div>

      <div className="articles-grid">
        {articles.map((article, index) => (
          <div key={index} className="article-card">
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} className="article-image" />
            )}
            <div className="article-content">
              <h3 className="article-title">{article.title}</h3>
              <p className="article-description">{article.description}</p>
              <div className="article-meta">
                <span className="article-source">{article.source?.name}</span>
                <span className="article-date">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="read-more-link"
              >
                Read Full Article
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsComponent;