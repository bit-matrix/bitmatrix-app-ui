import { NetworkString } from 'marina-provider';
import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { EXPLORER } from '../../enum/EXPLORER';
import { PREFERRED_UNIT } from '../../enum/PREFERRED_UNIT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import {
  setExclusiveThemesAction,
  setExplorerAction,
  setNetworkAction,
  setPreferredUnitAction,
  setSlippageAction,
  setThemeAction,
} from './actions';
import { initialSettingsState, settingsReducer } from './reducer';
import { ISettingsContext } from './types';

type Props = {
  children: ReactNode;
};

type CP = ComponentProps<FC> & Props;

const SettingsContext = createContext<ISettingsContext>({} as ISettingsContext);

export const useSettingsContext = (): ISettingsContext => useContext(SettingsContext);

export const SettingsContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
  const [settingsContext, dispatch] = useReducer(settingsReducer, initialSettingsState);

  const setSlippageContext = (slippage: number): void => {
    setSlippageAction(slippage, dispatch);
  };

  const setPreferredUnitContext = (preferred_unit: { text: PREFERRED_UNIT; value: PREFERRED_UNIT_VALUE }): void => {
    setPreferredUnitAction(preferred_unit, dispatch);
  };

  const setThemeContext = (theme: SELECTED_THEME): void => {
    setThemeAction(theme, dispatch);
  };

  const setExclusiveThemesContext = (exclusiveThemes: string[]): void => {
    setExclusiveThemesAction(exclusiveThemes, dispatch);
  };

  const setExplorerContext = (explorer: EXPLORER): void => {
    setExplorerAction(explorer, dispatch);
  };

  const setNetworkContext = (network: NetworkString): void => {
    setNetworkAction(network, dispatch);
  };

  return (
    <SettingsContext.Provider
      value={{
        settingsContext,
        setSlippageContext,
        setPreferredUnitContext,
        setThemeContext,
        setExclusiveThemesContext,
        setExplorerContext,
        setNetworkContext,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
