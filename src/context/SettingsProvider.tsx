import React, { useReducer } from 'react';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsStore } from '../model/SettingsStore';
import SettingsContext from './SettingsContext';
import reducer from './reducer';

const { getLocalData } = useLocalStorage<SettingsStore>('BmSettings');
const settings = getLocalData();

const SettingsProvider: React.FC = ({ children }) => {
  const [payloadData, dispatch] = useReducer(reducer, {
    slippage: settings?.slippage || 200,
    preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  });

  return <SettingsContext.Provider value={{ payloadData, dispatch }}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
