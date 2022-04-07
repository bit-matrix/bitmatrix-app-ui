import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { setPreferredUnitAction, setSlippageAction, setThemeAction } from './actions';
import { initialSettingsState, settingsReducer } from './reducer';
import { ISettingsContext } from './types';

type Props = {
  children: React.ReactNode;
};

const SettingsContext = createContext<ISettingsContext>({} as ISettingsContext);

export const useSettingsContext = (): ISettingsContext => useContext(SettingsContext);

export const SettingsContextProvider: React.FC<Props> = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [settingsContext, dispatch] = useReducer(settingsReducer, initialSettingsState);

  const setSlippageContext = (slippage: number): void => {
    setSlippageAction(slippage, dispatch);
  };

  const setPreferredUnitContext = (preferred_unit: { text: PREFERRED_UNIT; value: PREFERRED_UNIT_VALUE }): void => {
    setPreferredUnitAction(preferred_unit, dispatch);
  };

  const setThemeContext = (theme: { selectedTheme: SELECTED_THEME; exclusiveThemes: string[] }): void => {
    setThemeAction(theme, dispatch);
  };

  return (
    <SettingsContext.Provider value={{ settingsContext, setSlippageContext, setPreferredUnitContext, setThemeContext }}>
      {children}
    </SettingsContext.Provider>
  );
};
