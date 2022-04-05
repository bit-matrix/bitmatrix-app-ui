import React, { useEffect } from 'react';
import { AppRouter } from './components/AppRouter/AppRouter';
import { useSettingsContext } from './context';
import './App.scss';

const App = (): JSX.Element => {
  const { settingsContext } = useSettingsContext();

  useEffect(() => {
    document.documentElement.setAttribute('theme', settingsContext.theme.selectedTheme);
  }, []);

  return <AppRouter />;
};

export default App;
