import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../enum/PREFERRED_UNIT_VALUE';
import { SELECTED_THEME } from '../enum/SELECTED_THEME';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsStore } from '../model/SettingsStore';

const { getLocalData: getSettingsLocalData } = useLocalStorage<SettingsStore>('BmSettings');
const settings = getSettingsLocalData();

const { getLocalData: getThemeLocalData } = useLocalStorage<SELECTED_THEME>('theme');
const theme = getThemeLocalData();

export const initialState = {
  slippage: settings?.slippage || 200,
  preferred_unit: settings?.preferred_unit || { text: PREFERRED_UNIT.LBTC, value: PREFERRED_UNIT_VALUE.LBTC },
  theme: theme || SELECTED_THEME.NEON,
};
