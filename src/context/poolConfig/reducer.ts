import { BmConfig } from '@bitmatrix/models';
import { SetPoolConfigAction, SET_POOL_CONFIG } from './types';

export const initialPoolConfigState: BmConfig = {
  id: '',
  minRemainingSupply: 0,
  minTokenValue: 0,
  baseFee: { number: 0, hex: '' },
  serviceFee: { number: 0, hex: '' },
  commitmentTxFee: { number: 0, hex: '' },
  defaultOrderingFee: { number: 0, hex: '' },
  fundingOutputAddress: '',
  innerPublicKey: '',
  recipientValueMinus: 0,
  holderCovenant: {
    scriptpubkey: {
      main: '',
      token: '',
      lp: '',
    },
    controlBlockPrefix: {
      main: '',
      token: '',
      lp: '',
    },
  },
  mainCovenantScript: '',
};

export const poolConfigReducer = (state: BmConfig, action: SetPoolConfigAction): BmConfig => {
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