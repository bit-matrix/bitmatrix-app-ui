import React, { useReducer } from 'react';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';
import reducer from './reducer';
import SettingsContext from './SettingsContext';

const SettingsProvider: React.FC = ({ children }) => {
  const [payloadData, dispatch] = useReducer(reducer, {
    slippage: 200,
    preferred_unit: { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  });

  return <SettingsContext.Provider value={{ payloadData, dispatch }}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
