import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Pool } from '@bitmatrix/models';

const socketServerUrl = '//127.0.0.1:4499';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pools, setPools] = useState<Pool[]>();
  const [appLoading, setAppLoading] = useState<boolean>(true);

  const onPools = useCallback((pools: Pool[]) => {
    setPools(pools);
    setAppLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(socketServerUrl);

    socket.on('connect', () => {
      console.log('connect');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      setIsConnected(false);
    });

    socket.on('pools', (data) => {
      if (data) onPools(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsConnected(false);
      console.log('cleanup');
    };
  }, []);

  return {
    isConnected,
    appLoading,
    pools,
  };
};
