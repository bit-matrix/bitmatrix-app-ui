import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Pool } from '@bitmatrix/models';
import { DB_SOCKET_SERVER_URL } from '../config';
import { notify } from '../components/utils/utils';
import { usePoolContext } from '../context';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePoolsSocket = () => {
  const [isPoolsConnected, setIsPoolsConnected] = useState<boolean>(false);
  const [poolsLoading, setPoolsLoading] = useState<boolean>(true);
  const { setPoolsContext } = usePoolContext();

  const onPools = useCallback((pools: Pool[]) => {
    setPoolsContext(pools);
    setPoolsLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(DB_SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('connect pools');
      setIsPoolsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect pools');
      notify('Pools socket disconnect.', 'Bitmatrix Error : ');
      setIsPoolsConnected(false);
    });

    socket.on('pools', (data) => {
      if (data) onPools(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsPoolsConnected(false);
      console.log('cleanup pools');
    };
  }, []);

  return {
    isPoolsConnected,
    poolsLoading,
  };
};
