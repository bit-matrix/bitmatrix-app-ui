import React, { useContext, useEffect, useState } from 'react';
import { Toggle } from 'rsuite';
import './App.scss';
import { ThemeContext } from './context/ThemeContext';
import { ThemeProvider } from './context/ThemeProvider';
import Swap from './pages/Swap';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // const [theme, setTheme] = useState('');

  // useEffect(() => {
  //   let unmounted = false;
  //   if (!unmounted) {
  //     const currentTheme = localStorage.getItem('pentacle-app-theme');
  //     if (currentTheme != null) {
  //       setTheme(currentTheme);
  //     }
  //   }
  //   return () => {
  //     unmounted = true;
  //   };
  // }, []);

  // const toggleOnChange = (checked: boolean) => {
  //   if (checked) {
  //     setTheme('dark');
  //     localStorage.setItem('pentacle-app-theme', 'dark');
  //   } else {
  //     setTheme('light');
  //     localStorage.setItem('pentacle-app-theme', 'light');
  //   }
  // };

  return (
    <ThemeProvider>
      <div className="App">
        <div className={theme}>
          <Toggle checked={theme == 'dark'} onChange={toggleTheme} checkedChildren={<i>🌙</i>} unCheckedChildren={<i>🔆</i>} />
          <Swap />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
