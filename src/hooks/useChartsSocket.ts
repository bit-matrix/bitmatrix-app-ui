import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ChartSummary } from '@bitmatrix/models';
import { usePoolContext } from '../context';

const socketServerUrl = '//127.0.0.1:9901/';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChartsSocket = () => {
  const { poolsContext } = usePoolContext();

  const [isChartsConnected, setIsChartsConnected] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<ChartSummary[]>();
  const [chartsLoading, setChartsLoading] = useState<boolean>(true);

  const onChartsData = useCallback((chartsData: ChartSummary[]) => {
    setChartsData(chartsData);
    setChartsLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(socketServerUrl);
    const poolIds = poolsContext.map((pc) => pc.id);
    socket.on('connect', () => {
      console.log('connect charts');
      setIsChartsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect charts');
      setIsChartsConnected(false);
    });

    socket.emit('fetchpools', poolIds);

    socket.on('poolschart', (data) => {
      if (data && data.length > 0) onChartsData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsChartsConnected(false);
      console.log('cleanup charts');
    };
  }, [poolsContext]);

  return {
    isChartsConnected,
    chartsLoading,
    chartsData,
  };
};
