import React from 'react';
import './DateFilter.css';

const DateFilter = ({ 
  dateFilter, 
  sortOrder, 
  onDateFilterChange, 
  onSortOrderChange,
  customStartDate,
  customEndDate,
  onCustomDateChange 
}) => {
  const handleDateFilterChange = (e) => {
    onDateFilterChange(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    onSortOrderChange(e.target.value);
  };

  const handleCustomStartDateChange = (e) => {
    onCustomDateChange('start', e.target.value);
  };

  const handleCustomEndDateChange = (e) => {
    onCustomDateChange('end', e.target.value);
  };

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="date-filter-container">
      <div className="filter-section">
        <h3>📅 Date Filters</h3>
        
        <div className="filter-controls">
          {/* Date Range Filter */}
          <div className="filter-group">
            <label htmlFor="date-filter">Filter by:</label>
            <select 
              id="date-filter"
              name="dateFilter"
              value={dateFilter} 
              onChange={handleDateFilterChange}
              className="filter-select"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="filter-group">
            <label htmlFor="sort-order">Sort by date:</label>
            <select 
              id="sort-order"
              name="sortOrder"
              value={sortOrder} 
              onChange={handleSortOrderChange}
              className="filter-select"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateFilter === 'custom' && (
          <div className="custom-date-range">
            <div className="date-inputs">
              <div className="date-input-group">
                <label htmlFor="start-date">From:</label>
                <input
                  type="date"
                  id="start-date"
                  name="customStartDate"
                  value={customStartDate}
                  onChange={handleCustomStartDateChange}
                  max={today}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="end-date">To:</label>
                <input
                  type="date"
                  id="end-date"
                  name="customEndDate"
                  value={customEndDate}
                  onChange={handleCustomEndDateChange}
                  max={today}
                  min={customStartDate}
                  className="date-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Filter Buttons */}
      <div className="quick-filters">
        <button
          onClick={() => onDateFilterChange('today')}
          className={`quick-filter-btn ${dateFilter === 'today' ? 'active' : ''}`}
        >
          📅 Today
        </button>
        <button
          onClick={() => onDateFilterChange('week')}
          className={`quick-filter-btn ${dateFilter === 'week' ? 'active' : ''}`}
        >
          📆 This Week
        </button>
        <button
          onClick={() => onDateFilterChange('month')}
          className={`quick-filter-btn ${dateFilter === 'month' ? 'active' : ''}`}
        >
          🗓️ This Month
        </button>
        <button
          onClick={() => onDateFilterChange('all')}
          className={`quick-filter-btn ${dateFilter === 'all' ? 'active' : ''}`}
        >
          🌐 All Time
        </button>
      </div>
    </div>
  );
};

export default DateFilter;