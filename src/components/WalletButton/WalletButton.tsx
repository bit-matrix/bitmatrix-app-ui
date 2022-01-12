import React, { useContext, useState } from 'react';
import { Button } from 'rsuite';
import SettingsContext from '../../context/SettingsContext';
import { WALLET_NAME } from '../../lib/wallet/WALLET_NAME';
import { WalletListModal } from '../WalletListModal/WalletListModal';
import './WalletButton.scss';

type Props = {
  text: string;
  disabled?: boolean;
  onClick: () => void;
};

export const WalletButton: React.FC<Props> = ({ text, onClick, disabled = false }) => {
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const { payloadData } = useContext(SettingsContext);

  return (
    <>
      <WalletListModal
        show={showWalletList}
        wallet={payloadData.wallet?.marina}
        walletOnClick={(walletName: WALLET_NAME) => console.log(walletName)}
        close={() => setShowWalletList(false)}
      />
      <Button
        appearance="default"
        className="wallet-button"
        onClick={() => {
          if (payloadData.wallet?.isEnabled) {
            onClick();
          } else {
            setShowWalletList(true);
          }
        }}
        disabled={disabled}
      >
        {payloadData.wallet?.isEnabled ? text : 'Connect Wallet'}
      </Button>
    </>
  );
};
