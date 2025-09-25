import React, { useState } from 'react';
import votingService from '../services/votingService';
import { useAuth } from '../contexts/AuthContext';
import './VotingButtons.css';

const VotingButtons = ({ article, onVote }) => {
  const { isAuthenticated } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [votingError, setVotingError] = useState(null);
  const { _voting } = article;
  
  const handleVote = async (voteType) => {
    if (isVoting) return;

    setIsVoting(true);
    setVotingError(null);

    try {
      const result = await votingService.vote(_voting.id, voteType === 'up' ? 'upvote' : 'downvote');
      
      // Call parent callback with updated vote data
      if (onVote) {
        onVote(article, voteType, result);
      }
    } catch (error) {
      console.error('Voting error:', error);
      setVotingError('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="voting-container">
      <div className="vote-buttons">
        <button
          className={`vote-btn upvote-btn ${_voting.userVote === 'upvote' ? 'active' : ''}`}
          onClick={() => handleVote('up')}
          disabled={isVoting}
          title={isAuthenticated ? 'Upvote this article' : 'Sign in to save votes across devices'}
        >
          <span className="vote-icon">▲</span>
          <span className="vote-count">{_voting.upvotes}</span>
        </button>
        
        <div className="vote-score">
          <span className={`score ${_voting.score > 0 ? 'positive' : _voting.score < 0 ? 'negative' : ''}`}>
            {_voting.score > 0 ? '+' : ''}{_voting.score}
          </span>
        </div>
        
        <button
          className={`vote-btn downvote-btn ${_voting.userVote === 'downvote' ? 'active' : ''}`}
          onClick={() => handleVote('down')}
          disabled={isVoting}
          title={isAuthenticated ? 'Downvote this article' : 'Sign in to save votes across devices'}
        >
          <span className="vote-icon">▼</span>
          <span className="vote-count">{_voting.downvotes}</span>
        </button>
      </div>

      {votingError && (
        <div className="voting-error">
          <span>{votingError}</span>
          <button onClick={() => setVotingError(null)}>✕</button>
        </div>
      )}

      {isVoting && (
        <div className="voting-loading">
          <div className="voting-spinner"></div>
          <span>Voting...</span>
        </div>
      )}

      {!isAuthenticated && (
        <div className="auth-notice">
          <span>💡 Sign in to save your votes across devices</span>
        </div>
      )}
    </div>
  );
};

export default VotingButtons;