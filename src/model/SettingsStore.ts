import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';

export type SettingsStore = {
  slippage: number;
  preferred_unit: { text: PREFERRED_UNIT; value: number };
};
