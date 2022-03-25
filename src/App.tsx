import React, { useContext, useEffect } from 'react';
import { AppRouter } from './components/AppRouter/AppRouter';
import SettingsProvider from './context/SettingsProvider';
import SettingsContext from './context/SettingsContext';
import './App.scss';

const App = (): JSX.Element => {
  const { payloadData } = useContext(SettingsContext);

  useEffect(() => {
    document.documentElement.setAttribute('theme', payloadData.theme);
  }, []);

  return (
    <SettingsProvider>
      <AppRouter />
    </SettingsProvider>
  );
};

export default App;
