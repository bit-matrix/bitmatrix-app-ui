import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { detectProvider } from 'marina-provider';
import Decimal from 'decimal.js';
import { api, commitmentTx, fundingTxForLiquidity } from '@bitmatrix/lib';
import { CALL_METHOD, BmConfig } from '@bitmatrix/models';
import { Button, Content, Icon, Slider, Notification } from 'rsuite';
import SettingsContext from '../../../context/SettingsContext';
import { Wallet } from '../../../lib/wallet';
import { IWallet } from '../../../lib/wallet/IWallet';
import lp from '../../../images/lp.png';
import usdt from '../../../images/usdt.png';
import lbtc from '../../../images/liquid_btc.png';
import './RemoveLiquidity.scss';

const RemoveLiquidity = (): JSX.Element => {
  const { payloadData } = useContext(SettingsContext);
  const [wallet, setWallet] = useState<IWallet>();
  const [walletIsEnabled, setWalletIsEnabled] = useState<boolean>(false);
  const [lpTokenAmount, setLpTokenAmount] = useState<number>(0);
  const [poolConfigs, setPoolConfigs] = useState<BmConfig>();
  const [removalPercentage, setRemovalPercentage] = useState<number>(0);

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

      api.getBmConfigs(payloadData.pools[0].id).then((response: BmConfig) => {
        setPoolConfigs(response);
      });

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

  const notify = (title: string, description: string) => {
    Notification.open({
      title: title,
      description: <div className="notificationTx">{description}</div>,
      duration: 20000,
    });
  };

  const removeLiquidityClick = async () => {
    if (wallet) {
      const methodCall = CALL_METHOD.REMOVE_LIQUIDITY;

      const lpTokenAmountInput = new Decimal(lpTokenAmount).mul(removalPercentage).div(100).toNumber();
      console.log('lpTokenAmountInput', lpTokenAmountInput);

      if (payloadData.pools && poolConfigs) {
        const fundingTxInputs = fundingTxForLiquidity(
          0,
          lpTokenAmountInput,
          payloadData.pools[0],
          poolConfigs,
          methodCall,
        );

        const rawTxHex = await wallet.sendTransaction([
          {
            address: fundingTxInputs.fundingOutput1Address,
            value: fundingTxInputs.fundingOutput1Value,
            asset: fundingTxInputs.fundingOutput1AssetId,
          },
          {
            address: fundingTxInputs.fundingOutput2Address,
            value: fundingTxInputs.fundingOutput2Value,
            asset: fundingTxInputs.fundingOutput2AssetId,
          },
        ]);

        const fundingTxId = await api.sendRawTransaction(rawTxHex || '');

        console.log('fundingTxId', fundingTxId);

        if (fundingTxId && fundingTxId !== '') {
          const fundingTxDecode = await api.decodeRawTransaction(rawTxHex || '');

          const publicKey = fundingTxDecode.vin[0].txinwitness[1];

          const commitment = commitmentTx.liquidityRemoveCreateCommitmentTx(
            lpTokenAmountInput,
            fundingTxId,
            publicKey,
            poolConfigs,
            payloadData.pools[0],
          );

          console.log('commitment raw hex :', commitment);

          const commitmentTxId = await api.sendRawTransaction(commitment);

          notify('Commitment Tx Id : ', commitmentTxId);
        } else {
          notify('Wallet Error : ', 'Funding transaction could not be created.');
        }
      }
    }
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
              <div className="remove-liquidity-text-body">% {removalPercentage}</div>
            </div>
            <div className="remove-liquidity-slider">
              <Slider
                min={0}
                max={100}
                step={0.1}
                value={removalPercentage}
                onChange={(value: number) => setRemovalPercentage(value)}
              />
            </div>
            <div className="remove-liquidity-button-toolbar">
              <Button
                className="remove-liquidity-buttons mobile-hidden"
                appearance="ghost"
                onClick={() => setRemovalPercentage(10)}
              >
                % 10
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost" onClick={() => setRemovalPercentage(25)}>
                % 25
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost" onClick={() => setRemovalPercentage(50)}>
                % 50
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost" onClick={() => setRemovalPercentage(75)}>
                % 75
              </Button>
              <Button className="remove-liquidity-buttons" appearance="ghost" onClick={() => setRemovalPercentage(100)}>
                % 100
              </Button>
            </div>
          </div>

          <div className="liquidity-page-footer">
            <div className="liquidity-page-footer-line-item-first">
              <div>
                <span className="liquidity-page-footer-line-item-texts">L-BTC You Get</span>
                <img className="remove-liquidity-page-icons" src={lbtc} alt="" />
              </div>
              <div className="liquidity-page-footer-line-item-values">0</div>
            </div>
            <div className="liquidity-page-footer-line-item-second mobile-hidden">
              <div>
                <span className="liquidity-page-footer-line-item-texts">USDT You Get</span>
                <img className="remove-liquidity-page-icons" src={usdt} alt="" />
              </div>
              <div className="liquidity-page-footer-line-item-values">0</div>
            </div>
            <div className="liquidity-page-footer-line-item-third">
              <div>
                <span className="liquidity-page-footer-line-item-texts">LP You Redeem</span>
                <img className="remove-liquidity-page-icons" src={lp} alt="" />
              </div>
              <div className="liquidity-page-footer-line-item-values">0</div>
            </div>
          </div>
        </div>
        <div className="liquidity-button-content remove-liquidity-button">
          <Button appearance="default" className="liquidity-button" onClick={() => removeLiquidityClick()}>
            Remove Liquidity
          </Button>
        </div>
      </Content>
    </div>
  );
};

export default RemoveLiquidity;
