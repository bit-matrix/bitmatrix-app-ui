import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { detectProvider } from 'marina-provider';
import Decimal from 'decimal.js';
import { api, commitmentTx, convertion, fundingTxForLiquidity } from '@bitmatrix/lib';
import { CALL_METHOD, BmConfig } from '@bitmatrix/models';
import { Button, Content, Icon, Slider, Notification } from 'rsuite';
import SettingsContext from '../../../context/SettingsContext';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
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
  const [removalPercentage, setRemovalPercentage] = useState<number>(100);
  const [calcLpTokenAmount, setCalcLpTokenAmount] = useState<number>(0);

  const { setTxLocalData, getTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV2');

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
        const primaryPoolConfig = { ...response };
        primaryPoolConfig.defaultOrderingFee = { number: 3, hex: '0300000000' };

        setPoolConfigs(primaryPoolConfig);
      });

      fetchTokens().then((balances) => {
        const lpTokenInWallet = balances.find((bl) => bl.asset.assetHash === lpTokenAssetId);

        setLpTokenAmount(lpTokenInWallet?.amount || 0);
      });
    }
  }, [payloadData.pools]);

  useEffect(() => {
    const lpTokenAmountInput = new Decimal(lpTokenAmount)
      .mul(new Decimal(removalPercentage))
      .div(100)
      .ceil()
      .toNumber();

    setCalcLpTokenAmount(lpTokenAmountInput);
  }, [removalPercentage, lpTokenAmount]);

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

      if (payloadData.pools && poolConfigs) {
        const pool = payloadData.pools[0];

        const fundingTxInputs = fundingTxForLiquidity(0, calcLpTokenAmount, pool, poolConfigs, methodCall);

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

        if (fundingTxId && fundingTxId !== '') {
          const fundingTxDecode = await api.decodeRawTransaction(rawTxHex || '');

          const publicKey = fundingTxDecode.vin[0].txinwitness[1];

          const commitment = commitmentTx.liquidityRemoveCreateCommitmentTx(
            calcLpTokenAmount,
            fundingTxId,
            publicKey,
            poolConfigs,
            pool,
          );

          console.log('commitment raw hex :', commitment);

          const commitmentTxId = await api.sendRawTransaction(commitment);

          if (commitmentTxId && commitmentTxId !== '') {
            const calcLpAmounts = calcLpValues();

            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: new Decimal(calcLpAmounts.quoteReceived).toNumber(),
              quoteAsset: pool.quote.ticker,
              tokenAmount: new Decimal(calcLpAmounts.tokenReceived).toNumber(),
              tokenAsset: pool.token.ticker,
              lpAmount: calcLpTokenAmount,
              lpAsset: pool.lp.ticker,
              timestamp: new Date().valueOf(),
              success: false,
              completed: false,
              seen: false,
              method: CALL_METHOD.REMOVE_LIQUIDITY,
            };

            const storeOldData = getTxLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setTxLocalData(newStoreData);
          }

          notify('Commitment Tx Id : ', commitmentTxId);
        } else {
          notify('Wallet Error : ', 'Funding transaction could not be created.');
        }
      }
    }
  };

  const calcLpValues = () => {
    const currentPool = payloadData.pools;
    if (currentPool && currentPool.length > 0) {
      const lpAmountN = new Decimal(calcLpTokenAmount).toNumber();
      const recipientValue = convertion.calcRemoveLiquidityRecipientValue(currentPool[0], lpAmountN);
      return {
        quoteReceived: (Number(recipientValue.user_lbtc_received) / payloadData.preferred_unit.value).toFixed(2),
        tokenReceived: (Number(recipientValue.user_token_received) / PREFERRED_UNIT_VALUE.LBTC).toFixed(2),
      };
    }
    return { quoteReceived: '0', tokenReceived: '0' };
  };

  return (
    <div className="remove-liquidity-page-main">
      <Content className="remove-liquidity-page-content">
        <Button className="remove-liquidity-page-back-button" onClick={() => history.goBack()}>
          <Icon className="remove-liquidity-back-icon" icon="angle-left" size="4x" />
          <div className="remove-liquidity-back-text">L-BTC/USDT</div>
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

          <div className="remove-liquidity-page-footer">
            <div className="remove-liquidity-page-footer-line-item-first">
              <div>
                <span className="remove-liquidity-page-footer-line-item-texts">L-BTC You Get</span>
                <img className="remove-liquidity-page-icons" src={lbtc} alt="" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">{calcLpValues().quoteReceived}</div>
            </div>
            <div className="remove-liquidity-page-footer-line-item-second mobile-hidden">
              <div>
                <span className="remove-liquidity-page-footer-line-item-texts">USDT You Get</span>
                <img className="remove-liquidity-page-icons" src={usdt} alt="" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">{calcLpValues().tokenReceived}</div>
            </div>
            <div className="remove-liquidity-page-footer-line-item-third">
              <div>
                <span className="remove-liquidity-page-footer-line-item-texts">LP You Redeem</span>
                <img className="remove-liquidity-page-icons" src={lp} alt="" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">
                {(Number(calcLpTokenAmount) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8)}
              </div>
            </div>
          </div>
        </div>
        <div className="remove-liquidity-button-content">
          <Button appearance="default" className="remove-liquidity-button" onClick={() => removeLiquidityClick()}>
            Remove Liquidity
          </Button>
        </div>
      </Content>
    </div>
  );
};

export default RemoveLiquidity;
