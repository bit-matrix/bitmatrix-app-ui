import React, { useReducer } from 'react';
import reducer from './reducer';
import SettingsContext from './SettingsContext';

const UserProvider: React.FC = ({ children }) => {
  const [payloadData, dispatch] = useReducer(reducer, {});

  return (
    <SettingsContext.Provider value={{ payloadData, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default UserProvider;
