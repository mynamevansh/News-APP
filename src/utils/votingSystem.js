// Voting system utilities for news articles
class VotingSystem {
  constructor() {
    this.STORAGE_KEY = 'news_app_votes';
    this.USER_VOTES_KEY = 'news_app_user_votes';
    this.initializeStorage();
  }

  // Initialize localStorage if not exists
  initializeStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.USER_VOTES_KEY)) {
      localStorage.setItem(this.USER_VOTES_KEY, JSON.stringify({}));
    }
  }

  // Create unique ID for each article based on title and source
  generateArticleId(article) {
    const cleanTitle = article.title?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
    const cleanSource = article.source?.name?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '';
    return `${cleanSource}_${cleanTitle}`.substring(0, 50);
  }

  // Get vote counts for a specific article
  getVoteCounts(articleId) {
    const votes = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    return votes[articleId] || { upvotes: 0, downvotes: 0, score: 0 };
  }

  // Get all vote data
  getAllVotes() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
  }

  // Check if user has voted on this article
  hasUserVoted(articleId) {
    const userVotes = JSON.parse(localStorage.getItem(this.USER_VOTES_KEY));
    return userVotes[articleId] || null; // returns 'up', 'down', or null
  }

  // Cast a vote for an article
  vote(articleId, voteType) {
    const votes = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    const userVotes = JSON.parse(localStorage.getItem(this.USER_VOTES_KEY));
    
    const currentUserVote = userVotes[articleId];
    
    // Initialize article votes if not exists
    if (!votes[articleId]) {
      votes[articleId] = { upvotes: 0, downvotes: 0, score: 0 };
    }

    // Handle vote logic
    if (currentUserVote === voteType) {
      // User is removing their vote
      if (voteType === 'up') {
        votes[articleId].upvotes = Math.max(0, votes[articleId].upvotes - 1);
      } else {
        votes[articleId].downvotes = Math.max(0, votes[articleId].downvotes - 1);
      }
      delete userVotes[articleId];
    } else {
      // User is changing vote or voting for first time
      if (currentUserVote) {
        // Remove previous vote
        if (currentUserVote === 'up') {
          votes[articleId].upvotes = Math.max(0, votes[articleId].upvotes - 1);
        } else {
          votes[articleId].downvotes = Math.max(0, votes[articleId].downvotes - 1);
        }
      }
      
      // Add new vote
      if (voteType === 'up') {
        votes[articleId].upvotes += 1;
      } else {
        votes[articleId].downvotes += 1;
      }
      userVotes[articleId] = voteType;
    }

    // Calculate score (upvotes - downvotes)
    votes[articleId].score = votes[articleId].upvotes - votes[articleId].downvotes;

    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(votes));
    localStorage.setItem(this.USER_VOTES_KEY, JSON.stringify(userVotes));

    return votes[articleId];
  }

  // Sort articles by vote score (highest first)
  sortArticlesByVotes(articles) {
    return articles.map(article => {
      const articleId = this.generateArticleId(article);
      const voteCounts = this.getVoteCounts(articleId);
      const userVote = this.hasUserVoted(articleId);
      
      return {
        ...article,
        _voting: {
          id: articleId,
          upvotes: voteCounts.upvotes,
          downvotes: voteCounts.downvotes,
          score: voteCounts.score,
          userVote: userVote
        }
      };
    }).sort((a, b) => b._voting.score - a._voting.score);
  }

  // Get voting statistics
  getStats() {
    const votes = this.getAllVotes();
    const userVotes = JSON.parse(localStorage.getItem(this.USER_VOTES_KEY));
    
    const totalArticles = Object.keys(votes).length;
    const totalVotes = Object.values(votes).reduce((sum, vote) => sum + vote.upvotes + vote.downvotes, 0);
    const userTotalVotes = Object.keys(userVotes).length;
    
    return {
      totalArticles,
      totalVotes,
      userTotalVotes
    };
  }

  // Clear all votes (for testing/reset)
  clearAllVotes() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_VOTES_KEY);
    this.initializeStorage();
  }
}

// Export singleton instance
export const votingSystem = new VotingSystem();
export default votingSystem;