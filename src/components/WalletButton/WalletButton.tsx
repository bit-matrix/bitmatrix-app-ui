import React, { useContext, useState } from 'react';
import { Button } from 'rsuite';
import SettingsContext from '../../context/SettingsContext';
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
  const { payloadData } = useContext(SettingsContext);

  const swapLoading = (): React.ReactElement => {
    if (payloadData.theme === SELECTED_THEME.YELLOW) {
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
      <WalletListModal
        show={showWalletList}
        wallet={payloadData.wallet?.marina}
        close={() => setShowWalletList(false)}
      />
      <Button
        appearance="default"
        className={`wallet-button ${className}`}
        onClick={() => {
          if (payloadData.wallet?.isEnabled) {
            onClick();
          } else {
            setShowWalletList(true);
          }
        }}
        disabled={payloadData.wallet?.isEnabled && disabled}
      >
        {loading ? swapLoading() : payloadData.wallet?.isEnabled ? text : 'Connect Wallet'}
      </Button>
    </>
  );
};
