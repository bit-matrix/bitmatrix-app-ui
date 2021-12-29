/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const useLocalStorage = <T>(k: string) => {
  const getTxLocalData = (): T | undefined => {
    const value = localStorage.getItem(k);
    return value !== null ? JSON.parse(value) : undefined;
  };

  const setTxLocalData = (value: T) => {
    localStorage.setItem(k, JSON.stringify(value));
  };

  const clearTxLocalData = () => {
    localStorage.removeItem(k);
  };

  return { getTxLocalData, setTxLocalData, clearTxLocalData };
};
