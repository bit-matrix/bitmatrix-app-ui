import { Pool } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { setPoolsAction } from './actions';
import { poolsReducer } from './reducer';
import { IPoolContext } from './types';

type Props = {
  children: React.ReactNode;
};

type CP = ComponentProps<FC> & { children?: ReactNode };

const PoolsContext = createContext<IPoolContext>({} as IPoolContext);

export const usePoolContext = (): IPoolContext => useContext(PoolsContext);

export const PoolsContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
  const [poolsContext, dispatch] = useReducer(poolsReducer, []);

  const setPoolsContext = (pools: Pool[]): void => {
    setPoolsAction(pools, dispatch);
  };

  return <PoolsContext.Provider value={{ poolsContext, setPoolsContext }}>{children}</PoolsContext.Provider>;
};
