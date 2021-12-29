import React, { useReducer } from 'react';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import reducer from './reducer';
import SettingsContext from './SettingsContext';

const SettingsProvider: React.FC = ({ children }) => {
  const [payloadData, dispatch] = useReducer(reducer, {
    slippage: 200,
    preferred_unit: { text: PREFERRED_UNIT.LBTC, value: 100000000 },
  });

  return <SettingsContext.Provider value={{ payloadData, dispatch }}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
