import { AppState } from './AppState';
import { useSocket } from '../socket/useSocket';

export const useAppState = (): AppState => {
  const { pools, poolsLoading, isConnected } = useSocket();

  return {
    pools,
    poolsLoading,
    isConnected,
  };
};
