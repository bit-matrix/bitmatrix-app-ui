import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { setThemeAction } from './actions';
import { initialThemeState, themeReducer } from './reducer';
import { IThemeContext } from './types';

type Props = {
  children: React.ReactNode;
};

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const useThemeContext = (): IThemeContext => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<Props> = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [themeContext, dispatch] = useReducer(themeReducer, initialThemeState);

  const setThemeContext = (theme: SELECTED_THEME): void => {
    setThemeAction(theme, dispatch);
  };

  return <ThemeContext.Provider value={{ themeContext, setThemeContext }}>{children}</ThemeContext.Provider>;
};
