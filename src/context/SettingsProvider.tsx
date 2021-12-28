import React, { useReducer } from 'react';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import reducer from './reducer';
import SettingsContext from './SettingsContext';

const SettingsProvider: React.FC = ({ children }) => {
  const [payloadData, dispatch] = useReducer(reducer, {
    slippage: 200,
    preferred_unit: { text: PREFERRED_UNIT.SAT, value: 1 },
  });

  return (
    <SettingsContext.Provider value={{ payloadData, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
