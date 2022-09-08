import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { setBtcPriceAction } from './actions';
import { btcPriceReducer } from './reducer';
import { IBtcPriceContext } from './types';

type Props = {
  children: ReactNode;
};

type CP = ComponentProps<FC> & Props;

const BtcPriceContext = createContext<IBtcPriceContext>({} as IBtcPriceContext);

export const useBtcPriceContext = (): IBtcPriceContext => useContext(BtcPriceContext);

export const BtcPriceContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
  const [btcPrice, dispatch] = useReducer(btcPriceReducer, 0);

  const setBtcPriceContext = (value: number): void => {
    setBtcPriceAction(value, dispatch);
  };

  return <BtcPriceContext.Provider value={{ btcPrice, setBtcPriceContext }}>{children}</BtcPriceContext.Provider>;
};
