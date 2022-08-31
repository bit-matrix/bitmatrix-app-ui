import { Pool } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { setPoolsAction } from './actions';
import { poolsReducer } from './reducer';
import { IPoolContext } from './types';

type Props = {
  children: ReactNode;
};

type CP = ComponentProps<FC> & Props;

const PoolsContext = createContext<IPoolContext>({} as IPoolContext);

export const usePoolContext = (): IPoolContext => useContext(PoolsContext);

export const PoolsContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
  const [pools, dispatch] = useReducer(poolsReducer, []);

  const setPoolsContext = (pools: Pool[]): void => {
    setPoolsAction(pools, dispatch);
  };

  return <PoolsContext.Provider value={{ pools, setPoolsContext }}>{children}</PoolsContext.Provider>;
};
