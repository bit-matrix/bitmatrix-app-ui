import { BmConfig } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, useContext, useReducer } from 'react';
import { setPoolConfigAction } from './actions';
import { initialPoolConfigState, poolConfigReducer } from './reducer';
import { IPoolConfigContext } from './types';

type Props = {
  children: React.ReactNode;
};

const PoolConfigContext = createContext<IPoolConfigContext>({} as IPoolConfigContext);

export const usePoolConfigContext = (): IPoolConfigContext => useContext(PoolConfigContext);

export const PoolConfigContextProvider: React.FC<Props> = ({ children }: ComponentProps<FC>): JSX.Element => {
  const [poolConfigContext, dispatch] = useReducer(poolConfigReducer, initialPoolConfigState);

  const setPoolConfigContext = (config: BmConfig): void => {
    setPoolConfigAction(config, dispatch);
  };

  return (
    <PoolConfigContext.Provider value={{ poolConfigContext, setPoolConfigContext }}>
      {children}
    </PoolConfigContext.Provider>
  );
};
