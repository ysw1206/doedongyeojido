import { useState, useEffect } from 'react';

export type Theme = 'classic' | 'pink' | 'dark' | 'modern';

interface ThemeColors {
  primary: string;
  accent: string;
  text: string;
  hover: string;
}

const themePalette: Record<Theme, ThemeColors> = {
  classic: {
    primary: 'from-orange-400 to-orange-500',
    accent: 'from-orange-400 to-orange-500',
    text: 'text-orange-300',
    hover: 'hover:from-orange-500 hover:to-orange-600'
  },
  pink: {
    primary: 'from-pink-400 to-pink-500',
    accent: 'from-pink-400 to-pink-500',
    text: 'text-pink-300',
    hover: 'hover:from-pink-500 hover:to-pink-600'
  },
  dark: {
    primary: 'from-blue-600 to-blue-700',
    accent: 'from-blue-600 to-blue-700',
    text: 'text-blue-300',
    hover: 'hover:from-blue-700 hover:to-blue-800'
  },
  modern: {
    primary: 'from-gray-400 to-gray-500',
    accent: 'from-gray-400 to-gray-500',
    text: 'text-gray-300',
    hover: 'hover:from-gray-500 hover:to-gray-600'
  }
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('pink');

  useEffect(() => {
    // 로컬스토리지에서 저장된 테마 불러오기
    const savedTheme = localStorage.getItem('selectedTheme') as Theme;
    if (savedTheme && themePalette[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('selectedTheme', theme);
  };

  const getThemeColors = () => themePalette[currentTheme];

  return {
    currentTheme,
    applyTheme,
    getThemeColors,
    themePalette
  };
} 