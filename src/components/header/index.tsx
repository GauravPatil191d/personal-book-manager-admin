"use client";

import React, { useState } from "react";
import "./style.css";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
}) => {
  const [showToast, setShowToast] = useState(false);

  const handleNotificationClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <header className="woody-header">
      {/* Search Input Section */}
      <div className="woody-header__search-wrap">
        <div className="woody-header__search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          className="woody-header__search-input"
          placeholder="Search books by title, author, tag, or notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="woody-header__search-clear"
            onClick={() => onSearchChange("")}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Header Actions */}
      <div className="woody-header__actions">
        {/* Notifications Icon with 'Coming Soon' Popover */}
        <div className="woody-header__notif-wrap">
          <button
            className="woody-header__icon-btn"
            onClick={handleNotificationClick}
            title="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="woody-header__notif-dot" />
          </button>

          {showToast && (
            <div className="woody-header__toast">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span>Notifications Coming Soon!</span>
            </div>
          )}
        </div>

        {/* Primary Add Button */}
        <button
          className="woody-header__add-btn"
          onClick={onOpenAddModal}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add New Book</span>
        </button>
      </div>
    </header>
  );
};
