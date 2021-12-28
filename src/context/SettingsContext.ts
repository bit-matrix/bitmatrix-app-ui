import { createContext } from 'react';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import PayloadData from './PayloadData';

const SettingsContext = createContext<{
  payloadData: PayloadData;
  dispatch: React.Dispatch<{
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  }>;
}>({
  payloadData: {
    slippage: 200,
    preferred_unit: { text: PREFERRED_UNIT.SAT, value: 1 },
  },
  dispatch: () => null,
});

export default SettingsContext;
