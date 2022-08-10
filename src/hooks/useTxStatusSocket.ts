/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { notify } from '../components/utils/utils';
import { API_SOCKET_SERVER_URL } from '../config';
import { CommitmentStore } from '../model/CommitmentStore';
import { useLocalStorage } from './useLocalStorage';

enum TX_STATUS {
  PENDING,
  WAITING_PTX,
  WAITING_PTX_CONFIRM,
  SUCCESS,
  FAILED,
}

export type TxStatus = {
  txId: string;
  poolTxId: string;
  status: TX_STATUS;
  timestamp: number;
};

export const useTxStatusSocket = () => {
  const [isTxStatusConnected, setIsTxStatusConnected] = useState<boolean>(false);
  const [txStatues, setTxStatues] = useState<TxStatus[]>();
  const [txStatusLoading, setTxStatusLoading] = useState<boolean>(false);
  const { getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const onTxStatusData = useCallback((txStatues: TxStatus[]) => {
    setTxStatues(txStatues);
    setTxStatusLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(API_SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('connect txStatues');
      setIsTxStatusConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect txStatues');
      notify('Tx statuses socket disconnect.', 'Bitmatrix Error : ');
      setIsTxStatusConnected(false);
    });

    const txHistory = getLocalData();

    const unconfirmedTxs = txHistory?.filter((utx) => utx.completed === false);
    const txIds = unconfirmedTxs?.map((tx) => tx.txId);

    socket.emit('checkTxStatus', `${txIds}`);

    socket.on('checkTxStatusResponse', (data) => {
      // console.log('checkTxStatusResponse', data);
      if (data) onTxStatusData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsTxStatusConnected(false);
      console.log('cleanup txStatues');
    };
  }, []);

  return {
    isTxStatusConnected,
    txStatusLoading,
    txStatues,
  };
};
