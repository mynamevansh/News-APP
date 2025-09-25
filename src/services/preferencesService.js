// User preferences service
const API_BASE_URL = 'http://localhost:3002';

class PreferencesService {
  constructor() {
    this.localStorageKey = 'newsapp_preferences';
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

  // Get user preferences
  async getPreferences() {
    if (this.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/preferences`, {
          headers: this.getAuthHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          return data.preferences;
        }
      } catch (error) {
        console.error('Error fetching preferences from backend:', error);
      }
    }

    // Fallback to localStorage
    return this.getLocalPreferences();
  }

  // Get specific preference
  async getPreference(key) {
    if (this.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/preferences/${key}`, {
          headers: this.getAuthHeaders()
        });

        if (response.ok) {
          const data = await response.json();
          return data.value;
        }
      } catch (error) {
        console.error(`Error fetching preference ${key}:`, error);
      }
    }

    // Fallback to localStorage
    return this.getLocalPreference(key);
  }

  // Set specific preference
  async setPreference(key, value) {
    if (this.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/preferences/${key}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ value })
        });

        if (response.ok) {
          // Also save locally for immediate use and offline fallback
          this.setLocalPreference(key, value);
          return true;
        }
      } catch (error) {
        console.error(`Error setting preference ${key}:`, error);
      }
    }

    // Fallback to localStorage
    return this.setLocalPreference(key, value);
  }

  // Set multiple preferences at once
  async setPreferences(preferences) {
    if (this.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/preferences/bulk`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ preferences })
        });

        if (response.ok) {
          // Also save locally
          this.setLocalPreferences(preferences);
          return true;
        }
      } catch (error) {
        console.error('Error setting bulk preferences:', error);
      }
    }

    // Fallback to localStorage
    return this.setLocalPreferences(preferences);
  }

  // Set pagination preferences
  async setPaginationPreferences(paginationSettings) {
    if (this.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/preferences/pagination`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(paginationSettings)
        });

        if (response.ok) {
          this.setLocalPreference('pagination', paginationSettings);
          return true;
        }
      } catch (error) {
        console.error('Error setting pagination preferences:', error);
      }
    }

    return this.setLocalPreference('pagination', paginationSettings);
  }

  // Set filter preferences
  async setFilterPreferences(filterSettings) {
    if (this.isAuthenticated()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/preferences/filters`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(filterSettings)
        });

        if (response.ok) {
          this.setLocalPreference('filters', filterSettings);
          return true;
        }
      } catch (error) {
        console.error('Error setting filter preferences:', error);
      }
    }

    return this.setLocalPreference('filters', filterSettings);
  }

  // Local storage methods (fallback and guest users)
  getLocalPreferences() {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      return stored ? JSON.parse(stored) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Error reading local preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  getLocalPreference(key) {
    const preferences = this.getLocalPreferences();
    return preferences[key] !== undefined ? preferences[key] : this.getDefaultPreferences()[key];
  }

  setLocalPreference(key, value) {
    try {
      const preferences = this.getLocalPreferences();
      preferences[key] = value;
      localStorage.setItem(this.localStorageKey, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving local preference:', error);
      return false;
    }
  }

  setLocalPreferences(newPreferences) {
    try {
      const currentPreferences = this.getLocalPreferences();
      const updatedPreferences = { ...currentPreferences, ...newPreferences };
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedPreferences));
      return true;
    } catch (error) {
      console.error('Error saving local preferences:', error);
      return false;
    }
  }

  // Get default preferences
  getDefaultPreferences() {
    return {
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
  }

  // Sync local preferences to backend when user logs in
  async syncLocalPreferencesToBackend() {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const localPreferences = this.getLocalPreferences();
      const response = await fetch(`${API_BASE_URL}/api/preferences/bulk`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ preferences: localPreferences })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error syncing preferences:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear local preferences
  clearLocalPreferences() {
    try {
      localStorage.removeItem(this.localStorageKey);
      return true;
    } catch (error) {
      console.error('Error clearing local preferences:', error);
      return false;
    }
  }
}

// Create singleton instance
const preferencesService = new PreferencesService();

export default preferencesService;