const express = require('express');
const { dbHelpers } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /preferences - Get all user preferences
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = dbHelpers.getAllUserPreferences(userId);

    res.json({
      success: true,
      preferences
    });

  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).json({ 
      error: 'Failed to get user preferences',
      details: error.message 
    });
  }
});

// GET /preferences/:key - Get a specific user preference
router.get('/:key', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { key } = req.params;

    const value = dbHelpers.getUserPreference(userId, key);

    res.json({
      success: true,
      key,
      value
    });

  } catch (error) {
    console.error('Error getting user preference:', error);
    res.status(500).json({ 
      error: 'Failed to get user preference',
      details: error.message 
    });
  }
});

// POST /preferences/:key - Set a specific user preference
router.post('/:key', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ 
        error: 'Preference value is required' 
      });
    }

    dbHelpers.setUserPreference(userId, key, value);

    res.json({
      success: true,
      key,
      value,
      message: 'Preference saved successfully'
    });

  } catch (error) {
    console.error('Error setting user preference:', error);
    res.status(500).json({ 
      error: 'Failed to set user preference',
      details: error.message 
    });
  }
});

// POST /preferences/bulk - Set multiple user preferences at once
router.post('/bulk', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ 
        error: 'Preferences object is required' 
      });
    }

    // Set each preference
    Object.entries(preferences).forEach(([key, value]) => {
      dbHelpers.setUserPreference(userId, key, value);
    });

    res.json({
      success: true,
      preferences,
      message: 'Preferences saved successfully'
    });

  } catch (error) {
    console.error('Error setting bulk user preferences:', error);
    res.status(500).json({ 
      error: 'Failed to set user preferences',
      details: error.message 
    });
  }
});

// Common preference shortcuts for the news app

// POST /preferences/pagination - Set pagination preferences
router.post('/pagination', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { itemsPerPage, currentPage } = req.body;

    const paginationSettings = {};
    if (itemsPerPage !== undefined) paginationSettings.itemsPerPage = itemsPerPage;
    if (currentPage !== undefined) paginationSettings.currentPage = currentPage;

    dbHelpers.setUserPreference(userId, 'pagination', paginationSettings);

    res.json({
      success: true,
      pagination: paginationSettings,
      message: 'Pagination preferences saved successfully'
    });

  } catch (error) {
    console.error('Error setting pagination preferences:', error);
    res.status(500).json({ 
      error: 'Failed to set pagination preferences',
      details: error.message 
    });
  }
});

// POST /preferences/filters - Set filter preferences
router.post('/filters', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { dateFilter, sortOrder, customStartDate, customEndDate } = req.body;

    const filterSettings = {};
    if (dateFilter !== undefined) filterSettings.dateFilter = dateFilter;
    if (sortOrder !== undefined) filterSettings.sortOrder = sortOrder;
    if (customStartDate !== undefined) filterSettings.customStartDate = customStartDate;
    if (customEndDate !== undefined) filterSettings.customEndDate = customEndDate;

    dbHelpers.setUserPreference(userId, 'filters', filterSettings);

    res.json({
      success: true,
      filters: filterSettings,
      message: 'Filter preferences saved successfully'
    });

  } catch (error) {
    console.error('Error setting filter preferences:', error);
    res.status(500).json({ 
      error: 'Failed to set filter preferences',
      details: error.message 
    });
  }
});

// GET /preferences/defaults - Get default preferences for new users
router.get('/defaults', (req, res) => {
  const defaultPreferences = {
    pagination: {
      itemsPerPage: 10,
      currentPage: 1
    },
    filters: {
      dateFilter: 'all',
      sortOrder: 'newest',
      customStartDate: '',
      customEndDate: ''
    },
    theme: 'light',
    notifications: {
      email: false,
      browser: false
    }
  };

  res.json({
    success: true,
    defaults: defaultPreferences
  });
});

module.exports = router;