import { useEffect } from 'react';
import { AppRouter } from './routes/AppRouter';
import { useSettingsContext } from './context';
import './App.scss';

const App = (): JSX.Element => {
  const { settingsContext } = useSettingsContext();

  useEffect(() => {
    document.documentElement.setAttribute('theme', settingsContext.theme);
  }, []);

  return <AppRouter />;
};

export default App;
