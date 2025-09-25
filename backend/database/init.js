const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'newsapp.db');
const db = new Database(dbPath);

// Initialize database tables
function initializeDatabase() {
  console.log('Initializing database...');

  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      picture TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create user preferences table
  const createUserPreferencesTable = `
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      preference_key TEXT NOT NULL,
      preference_value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(user_id, preference_key)
    )
  `;

  // Create voting history table
  const createVotingHistoryTable = `
    CREATE TABLE IF NOT EXISTS voting_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      article_id TEXT NOT NULL,
      vote_type TEXT CHECK(vote_type IN ('upvote', 'downvote')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(user_id, article_id)
    )
  `;

  // Create articles voting summary table (for faster queries)
  const createArticleVotesTable = `
    CREATE TABLE IF NOT EXISTS article_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id TEXT UNIQUE NOT NULL,
      upvotes INTEGER DEFAULT 0,
      downvotes INTEGER DEFAULT 0,
      total_votes INTEGER DEFAULT 0,
      score INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create user sessions table for JWT token management
  const createUserSessionsTable = `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;

  try {
    // Execute table creation statements
    db.exec(createUsersTable);
    db.exec(createUserPreferencesTable);
    db.exec(createVotingHistoryTable);
    db.exec(createArticleVotesTable);
    db.exec(createUserSessionsTable);

    // Create indexes for better performance
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_voting_history_user_article ON voting_history(user_id, article_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_article_votes_article_id ON article_votes(article_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)`);

    console.log('Database initialized successfully!');
    console.log('Database location:', dbPath);

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Database helper functions
const dbHelpers = {
  // User operations
  createUser: (googleId, email, name, picture) => {
    const stmt = db.prepare(`
      INSERT INTO users (google_id, email, name, picture)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(googleId, email, name, picture);
  },

  getUserByGoogleId: (googleId) => {
    const stmt = db.prepare('SELECT * FROM users WHERE google_id = ?');
    return stmt.get(googleId);
  },

  getUserById: (userId) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(userId);
  },

  updateUserLastActive: (userId) => {
    const stmt = db.prepare('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(userId);
  },

  // User preferences operations
  setUserPreference: (userId, key, value) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_preferences (user_id, preference_key, preference_value, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(userId, key, JSON.stringify(value));
  },

  getUserPreference: (userId, key) => {
    const stmt = db.prepare('SELECT preference_value FROM user_preferences WHERE user_id = ? AND preference_key = ?');
    const result = stmt.get(userId, key);
    return result ? JSON.parse(result.preference_value) : null;
  },

  getAllUserPreferences: (userId) => {
    const stmt = db.prepare('SELECT preference_key, preference_value FROM user_preferences WHERE user_id = ?');
    const results = stmt.all(userId);
    const preferences = {};
    results.forEach(row => {
      preferences[row.preference_key] = JSON.parse(row.preference_value);
    });
    return preferences;
  },

  // Voting operations
  castVote: (userId, articleId, voteType) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO voting_history (user_id, article_id, vote_type, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(userId, articleId, voteType);
  },

  getUserVote: (userId, articleId) => {
    const stmt = db.prepare('SELECT vote_type FROM voting_history WHERE user_id = ? AND article_id = ?');
    const result = stmt.get(userId, articleId);
    return result ? result.vote_type : null;
  },

  removeVote: (userId, articleId) => {
    const stmt = db.prepare('DELETE FROM voting_history WHERE user_id = ? AND article_id = ?');
    return stmt.run(userId, articleId);
  },

  getUserVotes: (userId) => {
    const stmt = db.prepare('SELECT article_id, vote_type FROM voting_history WHERE user_id = ?');
    return stmt.all(userId);
  },

  // Article vote summary operations
  updateArticleVoteSummary: (articleId) => {
    const countStmt = db.prepare(`
      SELECT 
        SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END) as upvotes,
        SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END) as downvotes,
        COUNT(*) as total_votes
      FROM voting_history 
      WHERE article_id = ?
    `);
    
    const counts = countStmt.get(articleId);
    const upvotes = counts.upvotes || 0;
    const downvotes = counts.downvotes || 0;
    const totalVotes = counts.total_votes || 0;
    const score = upvotes - downvotes;

    const updateStmt = db.prepare(`
      INSERT OR REPLACE INTO article_votes (article_id, upvotes, downvotes, total_votes, score, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    return updateStmt.run(articleId, upvotes, downvotes, totalVotes, score);
  },

  getArticleVotes: (articleId) => {
    const stmt = db.prepare('SELECT * FROM article_votes WHERE article_id = ?');
    return stmt.get(articleId);
  },

  getAllArticleVotes: () => {
    const stmt = db.prepare('SELECT * FROM article_votes ORDER BY score DESC');
    return stmt.all();
  },

  // Session operations
  createSession: (userId, sessionToken, expiresAt) => {
    const stmt = db.prepare(`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `);
    return stmt.run(userId, sessionToken, expiresAt);
  },

  getSessionByToken: (sessionToken) => {
    const stmt = db.prepare(`
      SELECT us.*, u.google_id, u.email, u.name, u.picture
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.session_token = ? AND us.expires_at > CURRENT_TIMESTAMP
    `);
    return stmt.get(sessionToken);
  },

  deleteSession: (sessionToken) => {
    const stmt = db.prepare('DELETE FROM user_sessions WHERE session_token = ?');
    return stmt.run(sessionToken);
  },

  deleteExpiredSessions: () => {
    const stmt = db.prepare('DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP');
    return stmt.run();
  },

  // Statistics
  getVotingStats: () => {
    const totalUsersStmt = db.prepare('SELECT COUNT(*) as count FROM users');
    const totalVotesStmt = db.prepare('SELECT COUNT(*) as count FROM voting_history');
    const totalArticlesStmt = db.prepare('SELECT COUNT(*) as count FROM article_votes');
    
    return {
      totalUsers: totalUsersStmt.get().count,
      totalVotes: totalVotesStmt.get().count,
      totalArticlesVoted: totalArticlesStmt.get().count
    };
  }
};

module.exports = {
  initializeDatabase,
  db,
  dbHelpers
};