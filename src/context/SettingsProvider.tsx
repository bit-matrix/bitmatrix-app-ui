import React, { useReducer } from 'react';
import reducer from './reducer';
import SettingsContext from './SettingsContext';

const SettingsProvider: React.FC = ({ children }) => {
  const [payloadData, dispatch] = useReducer(reducer, { slippage: 200 });

  return (
    <SettingsContext.Provider value={{ payloadData, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
