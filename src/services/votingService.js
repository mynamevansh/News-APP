// Enhanced voting service that works with both localStorage (guest users) and backend (authenticated users)

import { votingSystem } from '../utils/votingSystem';

// Use votingSystem as the local fallback
const localVotingSystem = votingSystem;

const API_BASE_URL = 'http://localhost:3002';

class VotingService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupOnlineListener();
  }

  setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('newsapp_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('newsapp_token');
    const expiresAt = localStorage.getItem('newsapp_expires_at');
    
    if (!token || !expiresAt) return false;
    
    return new Date() < new Date(expiresAt);
  }

  // Vote on an article
  async vote(articleId, voteType) {
    try {
      if (this.isAuthenticated() && this.isOnline) {
        // Use backend for authenticated users
        return await this.voteOnline(articleId, voteType);
      } else {
        // Use localStorage for guest users or when offline
        return this.voteOffline(articleId, voteType);
      }
    } catch (error) {
      console.error('Voting error:', error);
      // Fallback to offline voting
      return this.voteOffline(articleId, voteType);
    }
  }

  // Online voting (authenticated users)
  async voteOnline(articleId, voteType) {
    const response = await fetch(`${API_BASE_URL}/api/voting/vote`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ articleId, voteType })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return {
        upvotes: data.votes.upvotes,
        downvotes: data.votes.downvotes,
        score: data.votes.score,
        userVote: data.userVote
      };
    } else {
      throw new Error(data.error || 'Vote failed');
    }
  }

  // Offline voting (guest users or fallback)
  voteOffline(articleId, voteType) {
    return localVotingSystem.vote(articleId, voteType);
  }

  // Get vote data for an article
  async getArticleVotes(articleId) {
    try {
      if (this.isOnline) {
        const response = await fetch(`${API_BASE_URL}/api/voting/article/${articleId}`, {
          headers: this.getAuthHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          return {
            upvotes: data.votes.upvotes,
            downvotes: data.votes.downvotes,
            score: data.votes.score,
            userVote: data.userVote
          };
        }
      }
    } catch (error) {
      console.error('Error fetching article votes:', error);
    }

    // Fallback to local storage
    return localVotingSystem.getArticleVotes(articleId);
  }

  // Get all vote data
  async getAllVotes() {
    try {
      if (this.isOnline) {
        const response = await fetch(`${API_BASE_URL}/api/voting/articles/all`, {
          headers: this.getAuthHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          return data.votes;
        }
      }
    } catch (error) {
      console.error('Error fetching all votes:', error);
    }

    // Fallback to local storage
    return localVotingSystem.getAllVotes();
  }

  // Sort articles by votes
  async sortArticlesByVotes(articles) {
    try {
      if (this.isAuthenticated() && this.isOnline) {
        // Get votes from backend
        const allVotes = await this.getAllVotes();
        return this.mergeArticlesWithVotes(articles, allVotes);
      } else {
        // Use local voting system
        return localVotingSystem.sortArticlesByVotes(articles);
      }
    } catch (error) {
      console.error('Error sorting articles by votes:', error);
      // Fallback to local voting system
      return localVotingSystem.sortArticlesByVotes(articles);
    }
  }

  // Merge articles with vote data
  mergeArticlesWithVotes(articles, votesData) {
    return articles.map(article => {
      const articleId = this.generateArticleId(article);
      const votes = votesData[articleId] || { upvotes: 0, downvotes: 0, score: 0, userVote: null };
      
      return {
        ...article,
        _voting: {
          id: articleId,
          upvotes: votes.upvotes,
          downvotes: votes.downvotes,
          score: votes.score,
          userVote: votes.userVote
        }
      };
    }).sort((a, b) => b._voting.score - a._voting.score);
  }

  // Generate consistent article ID
  generateArticleId(article) {
    return localVotingSystem.generateArticleId(article);
  }

  // Get voting statistics
  async getStats() {
    try {
      if (this.isAuthenticated() && this.isOnline) {
        const response = await fetch(`${API_BASE_URL}/api/voting/stats`, {
          headers: this.getAuthHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          return data.stats;
        }
      }
    } catch (error) {
      console.error('Error fetching voting stats:', error);
    }

    // Fallback to local stats
    return localVotingSystem.getStats();
  }

  // Check if user has voted on article
  hasUserVoted(articleId) {
    if (this.isAuthenticated()) {
      // For authenticated users, this info comes from the vote data
      // We'll get it when we fetch votes
      return null; // Will be populated when votes are fetched
    } else {
      return localVotingSystem.hasUserVoted(articleId);
    }
  }

  // Sync local votes to backend when user logs in
  async syncLocalVotesToBackend() {
    if (!this.isAuthenticated() || !this.isOnline) {
      return { success: false, error: 'Not authenticated or offline' };
    }

    try {
      const localVotes = localVotingSystem.getAllVotes();
      const syncResults = [];

      for (const [articleId, voteData] of Object.entries(localVotes)) {
        if (voteData.userVote) {
          try {
            await this.voteOnline(articleId, voteData.userVote);
            syncResults.push({ articleId, success: true });
          } catch (error) {
            syncResults.push({ articleId, success: false, error: error.message });
          }
        }
      }

      // Clear local votes after successful sync
      if (syncResults.some(result => result.success)) {
        localVotingSystem.clearAllVotes();
      }

      return { success: true, syncResults };
    } catch (error) {
      console.error('Error syncing votes:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear all local voting data (useful when switching between users)
  clearLocalVotes() {
    localVotingSystem.clearAllVotes();
  }
}

// Create singleton instance
const votingService = new VotingService();

export default votingService;