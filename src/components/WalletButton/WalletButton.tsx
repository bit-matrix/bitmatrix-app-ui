import React, { useState } from 'react';
import { Button } from 'rsuite';
import { useWalletContext } from '../../context';
import { useThemeContext } from '../../context/theme';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import BananaGif from '../../images/banana.gif';
import { Loading } from '../Loading/Loading';
import { WalletListModal } from '../WalletListModal/WalletListModal';
import './WalletButton.scss';

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
};

export const WalletButton: React.FC<Props> = ({ text, onClick, disabled = false, className, loading }) => {
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const { walletContext } = useWalletContext();
  const { themeContext } = useThemeContext();

  const swapLoading = (): React.ReactElement => {
    if (themeContext === SELECTED_THEME.YELLOW) {
      return (
        <div>
          <img src={BananaGif} alt="loading..." className="wallet-button-banana-gif" />
        </div>
      );
    } else {
      return (
        <div className="wallet-button-loading">
          <Loading width="1.5rem" height="1.5rem" />
        </div>
      );
    }
  };

  return (
    <>
      <WalletListModal show={showWalletList} wallet={walletContext?.marina} close={() => setShowWalletList(false)} />
      <Button
        appearance="default"
        className={`wallet-button ${className}`}
        onClick={() => {
          if (walletContext?.isEnabled) {
            onClick();
          } else {
            setShowWalletList(true);
          }
        }}
        disabled={walletContext?.isEnabled && disabled}
      >
        {loading ? swapLoading() : walletContext?.isEnabled ? text : 'Connect Wallet'}
      </Button>
    </>
  );
};
