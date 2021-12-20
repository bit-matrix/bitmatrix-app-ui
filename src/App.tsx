import React from 'react';
import { AppRouter } from './components/AppRouter/AppRouter';
import SettingsProvider from './context/SettingsProvider';
import './App.scss';

const App = (): JSX.Element => {
  return (
    <SettingsProvider>
      <AppRouter />
    </SettingsProvider>
  );
};

export default App;
