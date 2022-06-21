import { BmConfig } from '@bitmatrix/models';
import { Reducer } from 'react';
import { SetPoolConfigAction, SET_POOL_CONFIG } from './types';

export const initialPoolConfigState: BmConfig = {
  minRemainingSupply: 0,
  minTokenValue: 0,
  baseFee: { number: 0, hex: '' },
  serviceFee: { number: 0, hex: '' },
  commitmentTxFee: { number: 0, hex: '' },
  defaultOrderingFee: { number: 0, hex: '' },
  innerPublicKey: '',
  recipientValueMinus: 0,
};

export const poolConfigReducer: Reducer<BmConfig, SetPoolConfigAction> = (
  state: BmConfig,
  action: SetPoolConfigAction,
): BmConfig => {
  switch (action.type) {
    case SET_POOL_CONFIG:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
