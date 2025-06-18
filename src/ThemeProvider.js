// ThemeProvider.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const applyTheme = useCallback((newTheme) => {
    let effectiveTheme = newTheme;
    
    if (newTheme === 'auto') {
      effectiveTheme = systemTheme;
    }
    
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Also set a class for easier CSS targeting
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '') + ` theme-${effectiveTheme}`;
  }, [systemTheme]);

  // Apply theme to document
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const getEffectiveTheme = () => {
    return theme === 'auto' ? systemTheme : theme;
  };

  const value = {
    theme,
    effectiveTheme: getEffectiveTheme(),
    changeTheme,
    themes: ['light', 'dark', 'auto']
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};