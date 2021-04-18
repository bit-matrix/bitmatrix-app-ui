import React from 'react';

type Theme = 'light' | 'dark';
type ThemeContext = { theme: Theme; toggleTheme: (checked: boolean) => void };

export const ThemeContext = React.createContext<ThemeContext>({} as ThemeContext);

// export const ThemeContext = React.createContext('dark');
