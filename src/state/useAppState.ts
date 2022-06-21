import { AppState } from './AppState';
import { useSocket } from '../socket/useSocket';

export const useAppState = (): AppState => {
  const { pools, appLoading, isConnected } = useSocket();

  return {
    appLoading,
    pools: pools || [],
    isConnected,
  };
};
