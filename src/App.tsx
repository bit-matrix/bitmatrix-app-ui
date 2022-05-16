import React, { useEffect } from 'react';
// import { AppRouter } from './components/AppRouter/AppRouter';
import { useSettingsContext } from './context';
import './App.scss';
import { Maintenance } from './pages/Maintenance/Maintenance';

const App = (): JSX.Element => {
  const { settingsContext } = useSettingsContext();

  useEffect(() => {
    document.documentElement.setAttribute('theme', settingsContext.theme);
  }, []);

  // return <AppRouter />;
  return <Maintenance />;
};

export default App;
