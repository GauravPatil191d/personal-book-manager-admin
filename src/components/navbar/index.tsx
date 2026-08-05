"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

import { useLogin } from "@/context/login-context";

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const READING_QUOTES = [
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "So many books, so little time.", author: "Frank Zappa" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "Reading is essential for those who seek to rise above the ordinary.", author: "Jim Rohn" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "Think before you speak. Read before you think.", author: "Fran Lebowitz" },
  { text: "The reading of all good books is like a conversation with the finest minds.", author: "René Descartes" },
  { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
  { text: "A book is a dream that you hold in your hand.", author: "Neil Gaiman" },
  { text: "Reading gives us some place to go when we have to stay where we are.", author: "Mason Cooley" },
  { text: "Once you learn to read, you will be forever free.", author: "Frederick Douglass" },
  { text: "A great book should leave you with many experiences, and slightly exhausted at the end.", author: "William Styron" },
  { text: "Keep reading. It's one of the most marvelous adventures anyone can have.", author: "Lloyd Alexander" },
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "Books let you travel without moving your feet.", author: "Jhumpa Lahiri" },
  { text: "Good friends, good books, and a sleepy conscience: this is the ideal life.", author: "Mark Twain" },
  { text: "Discovering that your desires are universal desires is the beauty of literature.", author: "F. Scott Fitzgerald" },
  { text: "Show me a family of readers, and I will show you the people who move the world.", author: "Napoleon Bonaparte" },
  { text: "Fairy tales tell us not just that dragons exist, but that dragons can be beaten.", author: "Neil Gaiman" },
  { text: "If you don't like to read, you haven't found the right book.", author: "J.K. Rowling" },
  { text: "The world was hers for the reading.", author: "Betty Smith" },
  { text: "Literary greatness lies in how deeply you understand.", author: "Anonymous" },
  { text: "A book is a gift you can open again and again.", author: "Garrison Keillor" },
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "In the end, we are all stories. Make yours a best-seller.", author: "A.D. Posey" },
];

export const Navbar: React.FC<NavbarProps> = ({ activeTab = "dashboard", setActiveTab }) => {
  const router = useRouter();
  const { logoutContext } = useLogin();
  const [currentQuote, setCurrentQuote] = useState(READING_QUOTES[0]);
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  // Pick a random quote on mount / refresh
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * READING_QUOTES.length);
    setCurrentQuote(READING_QUOTES[randomIndex]);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      isWorking: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1"></rect>
          <rect x="14" y="3" width="7" height="5" rx="1"></rect>
          <rect x="14" y="12" width="7" height="9" rx="1"></rect>
          <rect x="3" y="16" width="7" height="5" rx="1"></rect>
        </svg>
      ),
    },
    {
      id: "your-books",
      label: "Your Books",
      isWorking: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      id: "notes",
      label: "Bookmarks & Notes",
      isWorking: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      id: "stats",
      label: "Reading Stats",
      isWorking: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      isWorking: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
  ];

  const handleNavClick = (item: { id: string; label: string; isWorking: boolean }) => {
    if (item.isWorking) {
      if (setActiveTab) {
        setActiveTab(item.id);
      }
      if (item.id === "your-books") {
        const elem = document.getElementById("your-books");
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      setComingSoonToast(item.label);
      setTimeout(() => {
        setComingSoonToast(null);
      }, 2500);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutContext();
    } catch (e) {
      localStorage.removeItem("accessToken");
    } finally {
      router.push("/login");
    }
  };

  return (
    <aside className="woody-navbar">
      {/* Text Branding Header */}
      <div className="woody-navbar__brand">
        <h1 className="woody-navbar__brand-name">Personal Book Manager</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="woody-navbar__menu">
        <div className="woody-navbar__menu-label">Navigation</div>

        {comingSoonToast && (
          <div className="woody-navbar__coming-soon-toast">
            <span>{comingSoonToast} &mdash; Coming Soon!</span>
          </div>
        )}

        <ul className="woody-navbar__list">
          {menuItems.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <li key={item.id} className="woody-navbar__item">
                <button
                  type="button"
                  className={`woody-navbar__link ${isSelected ? "woody-navbar__link--active" : ""}`}
                  onClick={() => handleNavClick(item)}
                >
                  <span className="woody-navbar__link-icon">{item.icon}</span>
                  <span className="woody-navbar__link-text">{item.label}</span>
                  {!item.isWorking ? (
                    <span className="woody-navbar__coming-soon-badge">Soon</span>
                  ) : (
                    isSelected && <div className="woody-navbar__gold-indicator" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dynamic 25 Quotes Carving Box */}
      <div className="woody-navbar__quote-card">
        <div className="quote-card__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <p className="quote-card__text">&ldquo;{currentQuote.text}&rdquo;</p>
        <span className="quote-card__author">&mdash; {currentQuote.author}</span>
      </div>

      {/* User Footer Profile */}
      <div className="woody-navbar__footer">
        <div className="woody-navbar__user">
          <div className="woody-navbar__avatar">GP</div>
          <div className="woody-navbar__user-info">
            <span className="woody-navbar__user-name">Gaurav Patil</span>
            <span className="woody-navbar__user-role">Avid Reader</span>
          </div>
        </div>
        <button
          className="woody-navbar__logout-btn"
          onClick={handleLogout}
          title="Sign Out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>
  );
};

