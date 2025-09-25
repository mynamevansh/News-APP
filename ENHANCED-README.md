# Enhanced News App with Voting System

A React-based news application that fetches real-time news articles and allows users to vote on them. Articles are automatically sorted based on community votes.

## 🚀 New Features

### 📰 More News Content
- **Increased Article Count**: Now fetches up to 50 news articles (previously ~10)
- **Real-time News**: Live data from NewsAPI.org
- **Article Images**: Visual news experience with thumbnails

### 🗳️ Voting System
- **Upvote/Downvote**: Vote on articles you like or dislike
- **One Vote Per User**: Each user can vote once per article
- **Vote Switching**: Change your mind and switch between upvote/downvote
- **Vote Removal**: Click the same vote button to remove your vote
- **Visual Feedback**: Active votes are highlighted with colors

### 📊 Smart Sorting
- **Vote-Based Ranking**: Articles automatically sort by vote score (upvotes - downvotes)
- **Real-time Reordering**: See articles move up/down as you and others vote
- **Article Rankings**: Clear #1, #2, #3... numbering system

### 💾 Persistent Data
- **localStorage Integration**: Your votes are saved between sessions
- **Vote Tracking**: System remembers what you've voted on
- **Statistics Display**: See total votes and your voting activity

## 🎮 How to Use

### Voting on Articles
1. **Upvote** (▲): Click the up arrow to like an article
2. **Downvote** (▼): Click the down arrow to dislike an article
3. **Change Vote**: Click the opposite arrow to switch your vote
4. **Remove Vote**: Click the same arrow again to remove your vote

### Understanding the Interface
- **Green Banner**: Live news mode with real API data
- **Article Rank**: #1, #2, #3... shows popularity order
- **Vote Score**: Center number shows net votes (upvotes - downvotes)
- **Statistics Bar**: Shows total articles, votes, and your voting activity

## 🛠️ Technical Implementation

### Files Structure
```
src/
├── components/
│   ├── VotingButtons.js      # Voting UI components
│   └── VotingButtons.css     # Voting styles
├── utils/
│   └── votingSystem.js       # Vote management logic
├── services/
│   └── api.js               # Enhanced API calls (50 articles)
└── App.js                   # Main app with voting integration
```

### Key Technologies
- **React Hooks**: useState, useEffect for state management
- **Axios**: HTTP client for API calls
- **localStorage**: Client-side vote persistence
- **CSS**: Responsive design with voting animations

### Voting Algorithm
```javascript
// Vote score calculation
score = upvotes - downvotes

// Sorting algorithm
articles.sort((a, b) => b.voting.score - a.voting.score)
```

## 🧪 Testing

The voting system includes comprehensive tests:

```bash
# Run voting system tests
node test-voting-system.js
```

Tests verify:
- ✅ Single vote per user enforcement
- ✅ Vote switching functionality
- ✅ Vote removal capability
- ✅ Score calculation accuracy
- ✅ Article sorting by votes

## 🌐 Live Demo

Your enhanced news app is running at: **http://localhost:3001**

### What You'll See:
- **50 Real News Articles** from various sources
- **Interactive Voting Buttons** on each article
- **Live Article Reordering** based on votes
- **Vote Statistics** in the header
- **Responsive Design** for mobile and desktop

## 📱 Responsive Features

- **Mobile Optimized**: Voting buttons adapt to small screens
- **Touch Friendly**: Large tap targets for mobile voting
- **Flexible Layout**: Articles stack vertically on mobile

## 🔧 Configuration

### API Settings
- **pageSize**: 50 articles (max 100 with NewsAPI)
- **country**: 'us' (can be changed)
- **category**: 'general' (can be customized)

### Vote Storage
- **Votes**: Stored in `localStorage` under 'news_app_votes'
- **User Votes**: Tracked in 'news_app_user_votes'
- **Persistence**: Survives browser restarts

## 🎯 Usage Tips

1. **Vote Early**: Be among the first to influence article ranking
2. **Check Statistics**: Monitor your voting activity in the header
3. **Mobile Experience**: Voting works great on phones/tablets
4. **Real-time Updates**: See articles reorder instantly after voting
5. **Vote Management**: Remove votes if you change your mind

## 📈 Future Enhancements

Potential improvements:
- User authentication for cross-device voting
- Category-based filtering with voting
- Comment system for articles
- Social sharing of highly-voted articles
- Vote analytics and trending topics

---

**Happy Voting!** 🗳️ Your enhanced news app is ready to use with full voting functionality!