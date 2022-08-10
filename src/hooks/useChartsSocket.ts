import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ChartSummary } from '@bitmatrix/models';
import { API_SOCKET_SERVER_URL } from '../config';
import { notify } from '../components/utils/utils';
import { useChartsContext } from '../context/charts';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChartsSocket = () => {
  const { setChartsContext } = useChartsContext();

  const [isChartsConnected, setIsChartsConnected] = useState<boolean>(false);
  const [chartsLoading, setChartsLoading] = useState<boolean>(true);

  const onChartsData = useCallback((chartsData: ChartSummary[]) => {
    setChartsContext(chartsData);
    setChartsLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(API_SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('connect charts');
      setIsChartsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect charts');
      notify('Charts socket disconnect.', 'Bitmatrix Error : ');
      setIsChartsConnected(false);
    });

    // socket.emit('fetchpools', poolIds);

    socket.on('poolschart', (data) => {
      if (data) onChartsData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsChartsConnected(false);
      console.log('cleanup charts');
    };
  }, []);

  return {
    isChartsConnected,
    chartsLoading,
  };
};
