import React, { useEffect } from 'react';
import { AppRouter } from './components/AppRouter/AppRouter';
import { useThemeContext } from './context/theme';
import './App.scss';

const App = (): JSX.Element => {
  const { themeContext } = useThemeContext();

  useEffect(() => {
    document.documentElement.setAttribute('theme', themeContext);
  }, []);

  return <AppRouter />;
};

export default App;
