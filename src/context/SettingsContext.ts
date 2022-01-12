import { createContext } from 'react';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';
import PayloadData from './PayloadData';
import { initialState } from './initialState';

const SettingsContext = createContext<{
  payloadData: PayloadData;
  dispatch: React.Dispatch<{
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  }>;
}>({
  payloadData: initialState,
  dispatch: () => null,
});

export default SettingsContext;
