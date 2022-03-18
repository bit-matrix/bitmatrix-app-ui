import React from 'react';
import { useContext } from 'react';
import SettingsContext from '../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../context/SETTINGS_ACTION_TYPES';
import { notify } from '../utils/utils';
import './NumericalInput.scss';

type Props = {
  onChange: (inputValue: string) => void;
  inputValue: string;
  className?: string;
  decimalLength?: number;
};

export const NumericalInput: React.FC<Props> = ({ onChange, inputValue, className, decimalLength = 2 }) => {
  const { payloadData, dispatch } = useContext(SettingsContext);

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d{0,${decimalLength}}$`);

  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const enforcer = (input: string) => {
    if (input === '' || inputRegex.test(escapeRegExp(input))) {
      onChange(input);
    }
  };

  const onFocus = () => {
    if (payloadData.wallet && payloadData.wallet.isEnabled) {
      payloadData.wallet.marina.getBalances().then((balances) => {
        dispatch({
          type: SETTINGS_ACTION_TYPES.SET_WALLET,
          payload: {
            ...payloadData,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            wallet: { marina: payloadData.wallet!.marina, isEnabled: true, balances },
          },
        });
      });
    } else {
      notify(
        <div className="notify-main-content">
          <div>Wallet is disabled, connect to wallet.</div>
          <a
            className="notify-link"
            href="https://medium.com/bit-matrix/the-public-testnet-beta-is-now-live-40c7ebfa6b50"
            target="_blank"
          >
            Learn More
          </a>
        </div>,
        'Wallet : ',
        'error',
      );
    }
  };

  return (
    <input
      className={className}
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      placeholder="0.0"
      spellCheck="false"
      value={inputValue}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
      onFocus={onFocus}
    />
  );
};
