import { createContext } from 'react';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';
import PayloadData from './PayloadData';

const SettingsContext = createContext<{
  payloadData: PayloadData;
  dispatch: React.Dispatch<{
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  }>;
}>({
  payloadData: { slippage: 200 },
  dispatch: () => null,
});

export default SettingsContext;
