import { Pool } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { setPoolsAction } from './actions';
import { initialPoolState, poolsReducer } from './reducer';
import { IPoolContext } from './types';

type Props = {
  children: React.ReactNode;
};

const PoolsContext = createContext<IPoolContext>({} as IPoolContext);

export const usePoolContext = (): IPoolContext => useContext(PoolsContext);

export const PoolsContextProvider: React.FC<Props> = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [pools, dispatch] = useReducer(poolsReducer, [initialPoolState]);

  const setPools = (pools: Pool[]): void => {
    setPoolsAction(pools, dispatch);
  };

  return <PoolsContext.Provider value={{ pools, setPools }}>{children}</PoolsContext.Provider>;
};
