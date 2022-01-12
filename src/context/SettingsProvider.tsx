import React, { useReducer } from 'react';
import SettingsContext from './SettingsContext';
import reducer from './reducer';
import { initialState } from './initialState';

const SettingsProvider: React.FC = ({ children }) => {
  const [payloadData, dispatch] = useReducer(reducer, initialState);

  return <SettingsContext.Provider value={{ payloadData, dispatch }}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
