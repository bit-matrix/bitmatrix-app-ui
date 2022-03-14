import { Pool } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { setPoolsAction } from './actions';
import { poolsReducer } from './reducer';
import { IPoolContext } from './types';

type Props = {
  children: React.ReactNode;
};

const PoolsContext = createContext<IPoolContext>({} as IPoolContext);

export const usePoolContext = (): IPoolContext => useContext(PoolsContext);

export const PoolsContextProvider: React.FC<Props> = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [poolsContext, dispatch] = useReducer(poolsReducer, []);

  const setPools = (pools: Pool[]): void => {
    setPoolsAction(pools, dispatch);
  };

  return <PoolsContext.Provider value={{ poolsContext, setPools }}>{children}</PoolsContext.Provider>;
};
