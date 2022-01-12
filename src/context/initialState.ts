import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsStore } from '../model/SettingsStore';

const { getLocalData } = useLocalStorage<SettingsStore>('BmSettings');
const settings = getLocalData();

export const initialState: SettingsStore = {
  slippage: settings?.slippage || 200,
  preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
};
