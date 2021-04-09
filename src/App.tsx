import React, { useEffect, useState } from 'react';
import { Toggle } from 'rsuite';
import './App.scss';
import Swap from './pages/Swap';

const App = () => {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      const currentTheme = localStorage.getItem('pentacle-app-theme');
      if (currentTheme != null) {
        setTheme(currentTheme);
      }
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const toggleOnChange = (checked: boolean) => {
    if (checked) {
      setTheme('dark');
      localStorage.setItem('pentacle-app-theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('pentacle-app-theme', 'light');
    }
  };

  return (
    <div className="App">
      <div className={theme}>
        <Toggle checked={theme == 'dark'} onChange={toggleOnChange} checkedChildren={<i>🌙</i>} unCheckedChildren={<i>🔆</i>} />
        <Swap />
      </div>
    </div>
  );
};

export default App;
