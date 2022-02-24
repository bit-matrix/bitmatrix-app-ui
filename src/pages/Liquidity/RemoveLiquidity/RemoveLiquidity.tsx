import React, { useContext, useEffect, useState } from 'react';
import Decimal from 'decimal.js';
import { api, commitmentTx, convertion, fundingTxForLiquidity } from '@bitmatrix/lib';
import { CALL_METHOD } from '@bitmatrix/models';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import { Button, Content, Slider } from 'rsuite';
import SettingsContext from '../../../context/SettingsContext';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import LpIcon from '../../../components/base/Svg/Icons/Lp';
import LbtcIcon from '../../../components/base/Svg/Icons/Lbtc';
import TetherIcon from '../../../components/base/Svg/Icons/Tether';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { getPrimaryPoolConfig, sleep } from '../../../helper';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { notify } from '../../../components/utils/utils';
import './RemoveLiquidity.scss';

const RemoveLiquidity = (): JSX.Element => {
  const [lpTokenAmount, setLpTokenAmount] = useState<number>(0);
  const [removalPercentage, setRemovalPercentage] = useState<number>(100);
  const [calcLpTokenAmount, setCalcLpTokenAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { payloadData } = useContext(SettingsContext);

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const history = useHistory();

  useEffect(() => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.wallet) {
      const currentPool = payloadData.pools[0];
      const lpTokenAssetId = currentPool.lp.asset;

      const lpTokenInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === lpTokenAssetId);

      setLpTokenAmount(lpTokenInWallet?.amount || 0);
    }
  }, [payloadData.pools, payloadData.wallet?.balances]);

  useEffect(() => {
    const lpTokenAmountInput = new Decimal(lpTokenAmount)
      .mul(new Decimal(removalPercentage))
      .div(100)
      .ceil()
      .toNumber();

    setCalcLpTokenAmount(lpTokenAmountInput);
  }, [removalPercentage, lpTokenAmount]);

  const removeLiquidityClick = async () => {
    if (payloadData.wallet?.marina) {
      const methodCall = CALL_METHOD.REMOVE_LIQUIDITY;

      if (payloadData.pools && payloadData.pool_config) {
        const pool = payloadData.pools[0];
        const primaryPoolConfig = getPrimaryPoolConfig(payloadData.pool_config);

        const fundingTxInputs = fundingTxForLiquidity(0, calcLpTokenAmount, pool, primaryPoolConfig, methodCall);

        let fundingTxId;

        try {
          setLoading(true);
          const fundingTx = await payloadData.wallet.marina.sendTransaction([
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

          fundingTxId = await api.sendRawTransaction(fundingTx.hex);
        } catch (err: any) {
          notify(err.toString(), 'Wallet Error : ', 'error');
          setLoading(false);
          return Promise.reject();
        }

        const addressInformation = await payloadData.wallet.marina.getNextChangeAddress();

        if (fundingTxId && fundingTxId !== '' && addressInformation.publicKey) {
          const primaryPoolConfig = getPrimaryPoolConfig(payloadData.pool_config);

          const commitment = commitmentTx.liquidityRemoveCreateCommitmentTx(
            calcLpTokenAmount,
            fundingTxId,
            addressInformation.publicKey,
            primaryPoolConfig,
            pool,
          );

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

            const storeOldData = getLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setLocalData(newStoreData);
          }

          // notify(
          //   <a target="_blank" href={`https://blockstream.info/liquidtestnet/tx/${commitmentTxId}`}>
          //     See in Explorer
          //   </a>,
          //   'Commitment Tx created successfully!',
          //   'success',
          // );
          setLoading(false);

          await sleep(3000);

          payloadData.wallet.marina.reloadCoins();
        } else {
          notify('Funding transaction could not be created.', 'Wallet Error : ', 'error');
          setLoading(false);
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
        quoteReceived: (Number(recipientValue.user_lbtc_received) / payloadData.preferred_unit.value).toString(),
        tokenReceived: (Number(recipientValue.user_token_received) / PREFERRED_UNIT_VALUE.LBTC).toFixed(2),
      };
    }
    return { quoteReceived: '0', tokenReceived: '0' };
  };

  return (
    <div className="remove-liquidity-page-main">
      <Content className="remove-liquidity-page-content">
        {/* {loading && <Loader className="remove-liquidity-page-loading" size="md" inverse center />} */}
        <BackButton
          buttonText="Remove Liquidity"
          onClick={() => {
            const prevPageLocation = history.location.state;
            if (prevPageLocation) {
              history.push({
                pathname: (prevPageLocation as { from: string }).from,
                state: {
                  from: history.location.pathname,
                },
              });
            } else {
              history.push({
                pathname: ROUTE_PATH.POOL,
                state: {
                  from: history.location.pathname,
                },
              });
            }
          }}
        />
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
              <div className="remove-liquidity-page-icon-content">
                <span className="remove-liquidity-page-footer-line-item-texts">
                  tL-{payloadData.preferred_unit.text} You Get
                </span>
                <LbtcIcon className="liquidity-btc-icon" width="1.5rem" height="1.5rem" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">{calcLpValues().quoteReceived}</div>
            </div>
            <div className="remove-liquidity-page-footer-line-item-second mobile-hidden">
              <div className="remove-liquidity-page-icon-content">
                <span className="remove-liquidity-page-footer-line-item-texts">tL-USDT You Get</span>
                <TetherIcon className="liquidity-usdt-icon" width="1.5rem" height="1.5rem" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">{calcLpValues().tokenReceived}</div>
            </div>
            <div className="remove-liquidity-page-footer-line-item-third">
              <div className="remove-liquidity-page-icon-content">
                <span className="remove-liquidity-page-footer-line-item-texts">LP You Redeem</span>
                <LpIcon className="add-liquidity-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="remove-liquidity-page-footer-line-item-values">
                {(Number(calcLpTokenAmount) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8)}
              </div>
            </div>
          </div>
        </div>
        <div className="remove-liquidity-button-content">
          <WalletButton
            text={`Remove tL-${payloadData.preferred_unit.text} and ${SWAP_ASSET.USDT}`}
            loading={loading}
            onClick={() => {
              removeLiquidityClick();
            }}
            disabled={calcLpTokenAmount <= 0}
            className="remove-liquidity-button"
          />
        </div>
      </Content>
    </div>
  );
};

export default RemoveLiquidity;
