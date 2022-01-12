import { PREFERRED_UNIT } from '../enum/PREFERRED_UNIT';
import PayloadData from './PayloadData';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const reducer = (
  state: PayloadData = {
    slippage: 200,
    preferred_unit: { text: PREFERRED_UNIT.SAT, value: 1 },
  },
  action: {
    type: SETTINGS_ACTION_TYPES;
    payload: PayloadData;
  },
) => {
  switch (action.type) {
    case SETTINGS_ACTION_TYPES.SET_SLIPPAGE:
      return {
        ...state,
        slippage: action.payload.slippage,
      };

    case SETTINGS_ACTION_TYPES.SET_PREFERRED_UNIT:
      return {
        ...state,
        preferred_unit: action.payload.preferred_unit,
      };

    case SETTINGS_ACTION_TYPES.SET_POOLS:
      return {
        ...state,
        pools: action.payload.pools,
      };

    case SETTINGS_ACTION_TYPES.SET_POOL_CONFIG:
      return {
        ...state,
        pool_config: action.payload.pool_config,
      };

    case SETTINGS_ACTION_TYPES.SET_WALLET:
      return {
        ...state,
        wallet: action.payload.wallet,
      };

    default:
      return state;
  }
};

export default reducer;
