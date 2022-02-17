import React, { useContext, useState } from 'react';
import { Button } from 'rsuite';
import SettingsContext from '../../context/SettingsContext';
import { WalletListModal } from '../WalletListModal/WalletListModal';
import './WalletButton.scss';

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
};

export const WalletButton: React.FC<Props> = ({
  text,
  onClick,
  disabled = false,
  className = 'wallet-button',
  loading,
}) => {
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const { payloadData } = useContext(SettingsContext);

  return (
    <>
      <WalletListModal
        show={showWalletList}
        wallet={payloadData.wallet?.marina}
        close={() => setShowWalletList(false)}
      />
      <Button
        appearance="default"
        loading={loading}
        className={className}
        onClick={() => {
          if (payloadData.wallet?.isEnabled) {
            onClick();
          } else {
            setShowWalletList(true);
          }
        }}
        disabled={payloadData.wallet?.isEnabled && disabled}
      >
        {payloadData.wallet?.isEnabled ? text : 'Connect Wallet'}
      </Button>
    </>
  );
};
