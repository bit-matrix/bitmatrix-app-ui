import React, { useState } from 'react';
import { Button } from 'rsuite';
import { useWalletContext } from '../../context';
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
  const { walletContext } = useWalletContext();

  return (
    <>
      <WalletListModal show={showWalletList} wallet={walletContext?.marina} close={() => setShowWalletList(false)} />
      <Button
        appearance="default"
        loading={loading}
        className={className}
        onClick={() => {
          if (walletContext?.isEnabled) {
            onClick();
          } else {
            setShowWalletList(true);
          }
        }}
        disabled={walletContext?.isEnabled && disabled}
      >
        {walletContext?.isEnabled ? text : 'Connect Wallet'}
      </Button>
    </>
  );
};
