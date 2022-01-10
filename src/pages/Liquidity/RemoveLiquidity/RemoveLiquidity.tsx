import { detectProvider } from 'marina-provider';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Content, Icon, Slider } from 'rsuite';
import SettingsContext from '../../../context/SettingsContext';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { Wallet } from '../../../lib/wallet';
import { IWallet } from '../../../lib/wallet/IWallet';
import LiquidityFooter from '../LiquidityFooter/LiquidityFooter';
import './RemoveLiquidity.scss';

const RemoveLiquidity = (): JSX.Element => {
  const { payloadData } = useContext(SettingsContext);
  const [wallet, setWallet] = useState<IWallet>();
  const [walletIsEnabled, setWalletIsEnabled] = useState<boolean>(false);
  const [lpTokenAmount, setLpTokenAmount] = useState<number>(0);

  const history = useHistory();

  useEffect(() => {
    detectProvider('marina')
      .then((marina) => {
        const marinaWallet = new Wallet();
        setWallet(marinaWallet);

        marina.isEnabled().then((enabled) => {
          setWalletIsEnabled(enabled);
        });
      })
      .catch(() => {
        const marinaWallet = new Wallet();
        setWallet(marinaWallet);
      });
  }, [walletIsEnabled]);

  useEffect(() => {
    if (payloadData.pools && payloadData.pools.length > 0) {
      const currentPool = payloadData.pools[0];
      const lpTokenAssetId = currentPool.lp.asset;

      fetchTokens().then((balances) => {
        const lpTokenInWallet = balances.find((bl) => bl.asset.assetHash === lpTokenAssetId);

        setLpTokenAmount(lpTokenInWallet?.amount || 0);
      });
    }
  }, [payloadData.pools]);

  const fetchTokens = async () => {
    if (wallet) {
      const balances = await wallet.getBalances();

      return balances;
    }

    return [];
  };

  return (
    <div className="liquidity-page-main">
      <Content className="liquidity-page-content">
        <Button className="liquidity-page-back-button" onClick={() => history.goBack()}>
          <Icon className="liquidity-back-icon" icon="angle-left" size="4x" />
          <div className="liquidity-back-text">L-BTC/USDT</div>
        </Button>
        <div>
          <div className="remove-liquidity-main">
            <div className="remove-liquidity-text">
              <div className="remove-liquidity-text-header">Removal Percentage</div>
              <div className="remove-liquidity-text-body">% 95.45</div>
            </div>
            <div className="remove-liquidity-slider">
              <Slider />
            </div>
            <div className="remove-liquidity-button-toolbar">
              <Button className="remove-liquidity-buttons mobile-hidden" appearance="ghost">
                % 10
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost">
                % 25
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost">
                % 50
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost">
                % 75
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost">
                % 100
              </Button>
            </div>
          </div>

          <LiquidityFooter received={'0'} rewards={'0'} pool_share={'0'} />
        </div>
        <div className="liquidity-button-content remove-liquidity-button">
          <Button appearance="default" className="liquidity-button">
            Remove Liquidity
          </Button>
        </div>
      </Content>
    </div>
  );
};

export default RemoveLiquidity;
