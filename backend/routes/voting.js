const express = require('express');
const { dbHelpers } = require('../database/init');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /voting/vote - Cast a vote for an article
router.post('/vote', authenticateToken, (req, res) => {
  try {
    const { articleId, voteType } = req.body;
    const userId = req.user.id;

    if (!articleId || !voteType) {
      return res.status(400).json({ 
        error: 'Article ID and vote type are required' 
      });
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ 
        error: 'Vote type must be either "upvote" or "downvote"' 
      });
    }

    // Check if user has already voted on this article
    const existingVote = dbHelpers.getUserVote(userId, articleId);

    if (existingVote === voteType) {
      // User is trying to vote the same way again - remove the vote
      dbHelpers.removeVote(userId, articleId);
    } else {
      // Cast or change the vote
      dbHelpers.castVote(userId, articleId, voteType);
    }

    // Update article vote summary
    dbHelpers.updateArticleVoteSummary(articleId);

    // Get updated vote counts
    const updatedVotes = dbHelpers.getArticleVotes(articleId);
    const userCurrentVote = dbHelpers.getUserVote(userId, articleId);

    res.json({
      success: true,
      articleId,
      votes: {
        upvotes: updatedVotes?.upvotes || 0,
        downvotes: updatedVotes?.downvotes || 0,
        totalVotes: updatedVotes?.total_votes || 0,
        score: updatedVotes?.score || 0
      },
      userVote: userCurrentVote
    });

  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ 
      error: 'Failed to process vote',
      details: error.message 
    });
  }
});

// GET /voting/article/:articleId - Get vote counts for a specific article
router.get('/article/:articleId', optionalAuth, (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user?.id;

    const votes = dbHelpers.getArticleVotes(articleId);
    const userVote = userId ? dbHelpers.getUserVote(userId, articleId) : null;

    res.json({
      success: true,
      articleId,
      votes: {
        upvotes: votes?.upvotes || 0,
        downvotes: votes?.downvotes || 0,
        totalVotes: votes?.total_votes || 0,
        score: votes?.score || 0
      },
      userVote
    });

  } catch (error) {
    console.error('Error getting article votes:', error);
    res.status(500).json({ 
      error: 'Failed to get article votes',
      details: error.message 
    });
  }
});

// GET /voting/articles/all - Get vote counts for all articles
router.get('/articles/all', optionalAuth, (req, res) => {
  try {
    const userId = req.user?.id;
    const allVotes = dbHelpers.getAllArticleVotes();
    
    // If user is authenticated, get their votes too
    let userVotes = {};
    if (userId) {
      const userVotesList = dbHelpers.getUserVotes(userId);
      userVotes = userVotesList.reduce((acc, vote) => {
        acc[vote.article_id] = vote.vote_type;
        return acc;
      }, {});
    }

    // Transform the data for easier frontend consumption
    const votesData = allVotes.reduce((acc, article) => {
      acc[article.article_id] = {
        upvotes: article.upvotes,
        downvotes: article.downvotes,
        totalVotes: article.total_votes,
        score: article.score,
        userVote: userVotes[article.article_id] || null
      };
      return acc;
    }, {});

    res.json({
      success: true,
      votes: votesData,
      totalArticles: allVotes.length
    });

  } catch (error) {
    console.error('Error getting all article votes:', error);
    res.status(500).json({ 
      error: 'Failed to get article votes',
      details: error.message 
    });
  }
});

// GET /voting/user/votes - Get all votes by the current user
router.get('/user/votes', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userVotes = dbHelpers.getUserVotes(userId);

    const votesData = userVotes.reduce((acc, vote) => {
      acc[vote.article_id] = vote.vote_type;
      return acc;
    }, {});

    res.json({
      success: true,
      votes: votesData,
      totalVotes: userVotes.length
    });

  } catch (error) {
    console.error('Error getting user votes:', error);
    res.status(500).json({ 
      error: 'Failed to get user votes',
      details: error.message 
    });
  }
});

// GET /voting/stats - Get overall voting statistics
router.get('/stats', (req, res) => {
  try {
    const stats = dbHelpers.getVotingStats();
    
    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error getting voting stats:', error);
    res.status(500).json({ 
      error: 'Failed to get voting statistics',
      details: error.message 
    });
  }
});

module.exports = router;