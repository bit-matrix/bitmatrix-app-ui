import { createContext } from 'react';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsStore } from '../model/SettingsStore';
import PayloadData from './PayloadData';

const { getLocalData } = useLocalStorage<SettingsStore>('BmSettings');
const settings = getLocalData();

const SettingsContext = createContext<{
  payloadData: PayloadData;
  dispatch: React.Dispatch<{
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  }>;
}>({
  payloadData: {
    slippage: settings?.slippage || 200,
    preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  },
  dispatch: () => null,
});

export default SettingsContext;
