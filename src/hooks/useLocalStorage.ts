/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useState } from 'react';

export const useLocalStorage = <T>(k: string) => {
  const value = localStorage.getItem(k);
  const object = value !== null ? JSON.parse(value) : undefined;
  const [data, setData] = useState<T | undefined>(object);

  const getTxLocalData = (): T | undefined => {
    return data;
  };

  const setTxLocalData = (value: T) => {
    setData(value);
    localStorage.setItem(k, JSON.stringify(value));
  };

  const clearTxLocalData = () => {
    localStorage.removeItem(k);
    setData(undefined);
  };

  return { getTxLocalData, setTxLocalData, clearTxLocalData };
};
