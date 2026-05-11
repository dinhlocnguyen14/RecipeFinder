import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { updateColors } from "../constants/colors";

const ThemeContext = createContext();

const THEME_STORAGE_KEY = "user_theme_preference";

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState("purple");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeName(savedTheme);
        updateColors(savedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme", error);
    } finally {
      setIsLoaded(true);
    }
  };

  const changeTheme = async (newThemeName) => {
    try {
      updateColors(newThemeName);
      setThemeName(newThemeName);
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, newThemeName);
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeName, changeTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
