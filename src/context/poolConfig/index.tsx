import { BmConfig } from '@bitmatrix/models';
import { ComponentProps, createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { setPoolConfigAction } from './actions';
import { initialPoolConfigState, poolConfigReducer } from './reducer';
import { IPoolConfigContext } from './types';

type Props = {
  children: ReactNode;
};

type CP = ComponentProps<FC> & Props;

const PoolConfigContext = createContext<IPoolConfigContext>({} as IPoolConfigContext);

export const usePoolConfigContext = (): IPoolConfigContext => useContext(PoolConfigContext);

export const PoolConfigContextProvider: React.FC<Props> = ({ children }: CP): JSX.Element => {
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
