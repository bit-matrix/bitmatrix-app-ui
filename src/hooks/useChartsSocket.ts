import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { ChartSummary, TxStatus } from '@bitmatrix/models';
import { API_SOCKET_SERVER_URL } from '../config';
import { notify } from '../components/utils/utils';
import { useChartsContext } from '../context/charts';
import { useLocalStorage } from './useLocalStorage';
import { CommitmentStore } from '../model/CommitmentStore';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChartsSocket = () => {
  const { setChartsContext } = useChartsContext();
  const [isChartsConnected, setIsChartsConnected] = useState<boolean>(false);
  const [chartsLoading, setChartsLoading] = useState<boolean>(true);
  const [txStatuses, setTxStatuses] = useState<TxStatus[]>();
  const [txStatusesLoading, setTxStatusesLoading] = useState<boolean>(true);

  const [socketInstance, setSocketInstance] = useState<Socket>();

  const { getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const onChartsData = useCallback((chartsData: ChartSummary[]) => {
    setChartsContext(chartsData);
    setChartsLoading(false);
  }, []);

  console.log('socket id', socketInstance?.id);

  useEffect(() => {
    const socket = io(API_SOCKET_SERVER_URL);
    setSocketInstance(socket);

    socket.on('connect', () => {
      console.log('connect api sockets');
      setIsChartsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect api sockets');
      notify('Api sockets socket disconnect.', 'Bitmatrix Error : ');
      setIsChartsConnected(false);
    });

    socket.on('poolschart', (data) => {
      if (data) onChartsData(data);
    });

    const txHistory = getLocalData();

    if (txHistory && txHistory.length > 0) {
      const unconfirmedTxs = txHistory.filter((utx) => utx.completed === false);

      if (unconfirmedTxs.length > 0) {
        const txIds = unconfirmedTxs.map((tx) => tx.txId);

        socket.emit('checkTxStatus', `${txIds}`);
      } else {
        setTxStatusesLoading(false);
      }
    } else {
      setTxStatusesLoading(false);
    }

    socket.on('checkTxStatusResponse', (data) => {
      setTxStatuses(data);
      setTxStatusesLoading(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsChartsConnected(false);
      console.log('cleanup charts');
    };
  }, []);

  const checkTxStatusWithIds = () => {
    if (socketInstance) {
      const txHistory = getLocalData();

      if (txHistory && txHistory.length > 0) {
        const unconfirmedTxs = txHistory.filter((utx) => utx.completed === false);

        if (unconfirmedTxs.length > 0) {
          const txIds = unconfirmedTxs.map((tx) => tx.txId);

          socketInstance.emit('checkTxStatus', `${txIds}`);
        }
      }
    }
  };

  return {
    isChartsConnected,
    chartsLoading,
    txStatuses,
    txStatusesLoading,
    checkTxStatusWithIds,
  };
};
