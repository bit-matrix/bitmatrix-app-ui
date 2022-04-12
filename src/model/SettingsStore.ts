import { EXPLORER } from '../enum/EXPLORER';
import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import { SELECTED_THEME } from '../enum/SELECTED_THEME';

export type SettingsStore = {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
  theme: SELECTED_THEME;
  explorer: EXPLORER;
};
