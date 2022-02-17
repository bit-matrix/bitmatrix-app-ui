import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { setPreferredUnitAction, setSlippageAction } from './actions';
import { initialSettingsState, settingsReducer } from './reducer';
import { ISettingsContext } from './types';

const SettingsContext = createContext<ISettingsContext>({} as ISettingsContext);

export const useSettingsContext = (): ISettingsContext => useContext(SettingsContext);

export const SettingsContextProvider: React.FC = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettingsState);

  const setSlippage = (slippage: number): void => {
    setSlippageAction(slippage, dispatch);
  };

  const setPreferredUnit = (preferred_unit: { text: PREFERRED_UNIT; value: PREFERRED_UNIT_VALUE }): void => {
    setPreferredUnitAction(preferred_unit, dispatch);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSlippage, setPreferredUnit }}>{children}</SettingsContext.Provider>
  );
};
