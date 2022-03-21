import React, { useEffect } from 'react';
import { AppRouter } from './components/AppRouter/AppRouter';
import SettingsProvider from './context/SettingsProvider';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SELECTED_THEME } from './enum/SELECTED_THEME';
import './App.scss';

const App = (): JSX.Element => {
  const { getLocalData } = useLocalStorage<SELECTED_THEME>('theme');

  useEffect(() => {
    const storedTheme = getLocalData();
    if (storedTheme) {
      document.documentElement.setAttribute('theme', storedTheme);
    }
  }, []);

  return (
    <SettingsProvider>
      <AppRouter />
    </SettingsProvider>
  );
};

export default App;
