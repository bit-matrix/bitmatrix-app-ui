import React, { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeContext = { theme: Theme; toggleTheme: (checked: boolean) => void };

export const ThemeContext = React.createContext<ThemeContext>({} as ThemeContext);

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  // const toggleTheme = (checked: boolean) => {
  //   setTheme(theme === 'light' ? 'dark' : 'light');
  // };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      const currentTheme = localStorage.getItem('pentacle-app-theme');
      if (currentTheme != null) {
        setTheme(currentTheme as Theme);
      }
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const toggleTheme = (checked: boolean) => {
    console.log('here');

    if (checked) {
      setTheme('dark');
      localStorage.setItem('pentacle-app-theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('pentacle-app-theme', 'light');
    }
  };

  const color = theme === 'light' ? '#333' : '#FFF';
  const backgroundColor = theme === 'light' ? '#FFF' : '#333';

  document.body.style.color = color;
  document.body.style.backgroundColor = backgroundColor;

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
