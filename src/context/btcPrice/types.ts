export const SET_BTC_PRICE = 'SET_BTC_PRICE';

export type SetBtcPriceAction = {
  type: typeof SET_BTC_PRICE;
  payload: number;
};

export interface IBtcPriceContext {
  btcPrice: number;
  setBtcPriceContext: (price: number) => void;
}
