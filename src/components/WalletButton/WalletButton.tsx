import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Whisper } from 'rsuite';
import { useWalletContext } from '../../context';
import { useSettingsContext } from '../../context';
import { SELECTED_THEME } from '../../enum/SELECTED_THEME';
import { IS_TESTNET, LBTC_ASSET } from '../../env';
import BananaGif from '../../images/banana.gif';
import { Loading } from '../base/Loading/Loading';
import { WalletListModal } from '../WalletListModal/WalletListModal';
import './WalletButton.scss';

type Props = {
  text: string;
  onClick: () => void;
  isDisconnetWallet?: boolean;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
};

export const WalletButton: React.FC<Props> = ({
  text,
  onClick,
  isDisconnetWallet = false,
  disabled = false,
  className,
  loading,
}) => {
  const [showWalletList, setShowWalletList] = useState<boolean>(false);
  const [network, setNetwork] = useState('');
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();

  useEffect(() => {
    const networkSelection = async () => {
      if (walletContext) {
        const currentNetwork = await walletContext.marina.getNetwork();

        setNetwork(currentNetwork);
      }
    };

    networkSelection();
  }, [walletContext]);

  const swapLoading = (): React.ReactElement => {
    if (settingsContext.exclusiveThemes.length > 0 && settingsContext.theme === SELECTED_THEME.BANANA) {
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

  const buttonDisabled = () => {
    if (walletContext) {
      if (walletContext.isEnabled) {
        if (isDisconnetWallet) {
          return false;
        }

        if (IS_TESTNET ? network === 'testnet' : network === 'liquid') {
          if (disabled) return true;

          return false;
        }

        return true;
      }
    }

    return false;
  };

  return (
    <>
      <WalletListModal show={showWalletList} wallet={walletContext?.marina} close={() => setShowWalletList(false)} />
      <Whisper
        disabled={
          (!walletContext?.isEnabled ||
            walletContext?.balances.find((bl) => bl.asset.assetHash === LBTC_ASSET.assetHash)?.amount ||
            0) > 1000 || isDisconnetWallet
        }
        placement="top"
        trigger="hover"
        speaker={<Tooltip style={{ zIndex: 9999 }}>You must have minimum 1000 sats to cover fees.</Tooltip>}
      >
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
          disabled={buttonDisabled()}
        >
          {loading ? swapLoading() : walletContext?.isEnabled ? text : 'Connect Wallet'}
        </Button>
      </Whisper>
    </>
  );
};
