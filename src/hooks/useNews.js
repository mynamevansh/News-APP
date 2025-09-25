import { useState, useEffect } from 'react';
import { fetchNews, searchNews } from '../services/api';

// Custom hook for news data
export const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = async (category = 'general') => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNews(category);
      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const searchForNews = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchNews(query);
      setArticles(data.articles || []);
    } catch (err) {
      setError('Failed to search news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return {
    articles,
    loading,
    error,
    loadNews,
    searchForNews
  };
};

// Custom hook for a single news fetch
export const useFetchNews = (category = 'general') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchNews(category);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [category]);

  return { data, loading, error };
};