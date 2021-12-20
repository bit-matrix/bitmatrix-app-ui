import PayloadData from './PayloadData';
import SETTINGS_ACTION_TYPES from './SETTINGS_ACTION_TYPES';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const reducer = (
  state: PayloadData = {},
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

    default:
      return state;
  }
};

export default reducer;
