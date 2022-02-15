import React, { useContext, useState } from 'react';
import { api, commitmentTx, convertion, fundingTxForLiquidity } from '@bitmatrix/lib';
import { CALL_METHOD } from '@bitmatrix/models';
import { Content, Loader } from 'rsuite';
import Decimal from 'decimal.js';
import SettingsContext from '../../../context/SettingsContext';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { SwapFromTab } from '../../../components/SwapFromTab/SwapFromTab';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { getPrimaryPoolConfig } from '../../../helper';
import FROM_AMOUNT_PERCENT from '../../../enum/FROM_AMOUNT_PERCENT';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import plus from '../../../images/plus.png';
import btc from '../../../images/liquid_btc.png';
import usdt from '../../../images/usdt.png';
import lp from '../../../images/lp.png';
import pct from '../../../images/pct.png';
import rew from '../../../images/rew.png';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { notify } from '../../../components/utils/utils';
import { NumericalInput } from '../../../components/NumericalInput/NumericalInput';
import './AddLiquidity.scss';

const AddLiquidity = (): JSX.Element => {
  const [lbctPercent, setLbtcPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [usdtPercent, setUsdtPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { payloadData } = useContext(SettingsContext);

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const onChangeQuoteAmount = (input: string) => {
    const inputNum = Number(input);

    if (payloadData.pools && payloadData.pool_config) {
      const primaryPoolConfig = getPrimaryPoolConfig(payloadData.pool_config);

      const output = convertion.convertForLiquidityCtx(
        inputNum * payloadData.preferred_unit.value,
        payloadData.pools[0],
        primaryPoolConfig,
      );

      setQuoteAmount(input);
      setTokenAmount((output / PREFERRED_UNIT_VALUE.LBTC).toFixed(2));
    }
  };

  const onChangeTokenAmount = (input: string) => {
    const inputNum = Number(input);

    if (payloadData.pools && payloadData.pool_config) {
      const primaryPoolConfig = getPrimaryPoolConfig(payloadData.pool_config);

      const output = convertion.convertForLiquidityCtx(
        inputNum * PREFERRED_UNIT_VALUE.LBTC,
        payloadData.pools[0],
        primaryPoolConfig,
        true,
      );

      setQuoteAmount((output / payloadData.preferred_unit.value).toString());
      setTokenAmount(input);
    }
  };

  const calcAmountPercent = (
    lbctPercent: FROM_AMOUNT_PERCENT | undefined,
    usdtPercent: FROM_AMOUNT_PERCENT | undefined,
  ) => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.pool_config && payloadData.wallet) {
      const currentPool = payloadData.pools[0];
      const poolConfig = payloadData.pool_config;

      let inputAmount = '';

      const quoteAssetId = currentPool.quote.asset;
      const quoteAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

      const tokenAssetId = currentPool.token.asset;
      const tokenAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

      const primaryPoolConfig = getPrimaryPoolConfig(payloadData.pool_config);

      const totalFee =
        primaryPoolConfig.baseFee.number +
        primaryPoolConfig.commitmentTxFee.number +
        primaryPoolConfig.defaultOrderingFee.number +
        primaryPoolConfig.serviceFee.number +
        1000;

      if (lbctPercent && quoteAmountInWallet) {
        if (lbctPercent === FROM_AMOUNT_PERCENT.ALL) {
          inputAmount = ((quoteAmountInWallet - totalFee) / payloadData.preferred_unit.value).toString();
        }
        if (lbctPercent === FROM_AMOUNT_PERCENT.HALF) {
          const quoteAmountInWalletHalf = quoteAmountInWallet / 2;
          inputAmount = (quoteAmountInWalletHalf / payloadData.preferred_unit.value).toString();
        }
        if (lbctPercent === FROM_AMOUNT_PERCENT.MIN) {
          inputAmount = (poolConfig.minRemainingSupply / payloadData.preferred_unit.value).toString();
        }
        onChangeQuoteAmount(inputAmount);
        setUsdtPercent(undefined);
        setLbtcPercent(lbctPercent);
      }
      if (usdtPercent && tokenAmountInWallet) {
        if (usdtPercent === FROM_AMOUNT_PERCENT.ALL) {
          inputAmount = (tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
        if (usdtPercent === FROM_AMOUNT_PERCENT.HALF) {
          const tokenAmountInWalletHalf = tokenAmountInWallet / 2;
          inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
        if (usdtPercent === FROM_AMOUNT_PERCENT.MIN) {
          inputAmount = (poolConfig.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
        onChangeTokenAmount(inputAmount);
        setLbtcPercent(undefined);
        setUsdtPercent(usdtPercent);
      }
    }
  };

  const inputsIsValid = () => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.pool_config && payloadData.wallet) {
      let tokenIsValid = false;
      let quoteIsValid = false;

      const currentPool = payloadData.pools[0];

      const quoteAssetId = currentPool.quote.asset;
      const quoteAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

      const tokenAssetId = currentPool.token.asset;
      const tokenAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

      if (quoteAmountInWallet && tokenAmountInWallet) {
        const quoteAmountWallet = quoteAmountInWallet / payloadData.preferred_unit.value;
        const tokenAmountWallet = (tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);

        if (Number(quoteAmount) <= quoteAmountWallet) {
          quoteIsValid = true;
        } else {
          quoteIsValid = false;
        }

        if (Number(tokenAmount) <= Number(tokenAmountWallet)) {
          tokenIsValid = true;
        } else {
          tokenIsValid = false;
        }

        return { tokenIsValid, quoteIsValid };
      }
    }
  };

  const addLiquidityClick = async () => {
    if (payloadData.wallet?.marina) {
      const methodCall = CALL_METHOD.ADD_LIQUIDITY;

      const quoteAmountN = new Decimal(Number(quoteAmount)).mul(payloadData.preferred_unit.value).toNumber();
      const tokenAmountN = new Decimal(tokenAmount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();

      if (payloadData.pools && payloadData.pool_config) {
        const pool = payloadData.pools[0];
        const primaryPoolConfig = getPrimaryPoolConfig(payloadData.pool_config);

        const fundingTxInputs = fundingTxForLiquidity(quoteAmountN, tokenAmountN, pool, primaryPoolConfig, methodCall);

        let fundingTxId;

        try {
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

          setLoading(true);
          fundingTxId = await api.sendRawTransaction(fundingTx.hex);
        } catch (err: any) {
          notify(err.toString(), 'Wallet Error : ', 'error');
          setLoading(false);
          return Promise.reject();
        }

        setLoading(true);

        const addressInformation = await payloadData.wallet.marina.getNextChangeAddress();

        if (fundingTxId && fundingTxId !== '' && addressInformation.publicKey) {
          setQuoteAmount('');
          setTokenAmount('');
          setLbtcPercent(undefined);
          setUsdtPercent(undefined);

          const primaryPoolConfig = getPrimaryPoolConfig(payloadData.pool_config);

          const commitment = commitmentTx.liquidityAddCreateCommitmentTx(
            quoteAmountN,
            tokenAmountN,
            fundingTxId,
            addressInformation.publicKey,
            primaryPoolConfig,
            pool,
          );

          const commitmentTxId = await api.sendRawTransaction(commitment);

          if (commitmentTxId && commitmentTxId !== '') {
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: quoteAmountN / payloadData.preferred_unit.value,
              quoteAsset: pool.quote.ticker,
              tokenAmount: tokenAmountN / PREFERRED_UNIT_VALUE.LBTC,
              tokenAsset: pool.token.ticker,
              lpAmount: new Decimal(calcLpValues().lpReceived).toNumber(),
              lpAsset: pool.lp.ticker,
              timestamp: new Date().valueOf(),
              success: false,
              completed: false,
              seen: false,
              method: CALL_METHOD.ADD_LIQUIDITY,
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
        } else {
          notify('Funding transaction could not be created.', 'Wallet Error : ', 'error');
          setLoading(false);
        }
      }
    }
  };

  const calcLpValues = () => {
    const currentPool = payloadData.pools;
    if (currentPool && currentPool.length > 0 && quoteAmount !== '' && tokenAmount !== '') {
      const quoteAmountN = new Decimal(Number(quoteAmount)).mul(payloadData.preferred_unit.value).toNumber();
      const tokenAmountN = new Decimal(tokenAmount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      const recipientValue = convertion.calcAddLiquidityRecipientValue(currentPool[0], quoteAmountN, tokenAmountN);
      return {
        lpReceived: (Number(recipientValue.lpReceived) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8),
        poolRate: (Number(recipientValue.poolRate) * 100).toFixed(2),
      };
    }
    return { lpReceived: '0', poolRate: '0' };
  };

  return (
    <div className="add-liquidity-page-main">
      <Content className="add-liquidity-page-content">
        {loading && <Loader className="add-liquidity-page-loading" size="md" inverse center />}
        <BackButton />
        <div>
          <div className="add-liquidity-main">
            <div
              className={`add-liquidity-item pt8 ${
                !inputsIsValid()?.quoteIsValid ? 'add-liquidity-invalid-content' : ''
              }`}
            >
              <SwapFromTab
                selectedFromAmountPercent={lbctPercent}
                setselectedFromAmountPercent={(lbtcPercent: FROM_AMOUNT_PERCENT | undefined) =>
                  calcAmountPercent(lbtcPercent, undefined)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{SWAP_ASSET.LBTC} Liquidity</div>
                    <img className="liquidity-btc-icon" src={btc} alt="" />
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={quoteAmount}
                    onChange={(inputValue) => onChangeQuoteAmount(inputValue)}
                    decimalLength={8}
                  />
                </div>
              </div>
            </div>
            <div className="add-liquidity-plus-icon">
              <img className="add-liquidity-page-icons" src={plus} alt="" />
            </div>
            <div
              className={`add-liquidity-item pt8 ${
                !inputsIsValid()?.tokenIsValid ? 'add-liquidity-invalid-content' : ''
              }`}
            >
              <SwapFromTab
                selectedFromAmountPercent={usdtPercent}
                setselectedFromAmountPercent={(usdtPercent: FROM_AMOUNT_PERCENT | undefined) =>
                  calcAmountPercent(undefined, usdtPercent)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{SWAP_ASSET.USDT} Liquidity</div>
                    <img className="liquidity-usdt-icon" src={usdt} alt="" />
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={tokenAmount}
                    onChange={(inputValue) => onChangeTokenAmount(inputValue)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="add-liquidity-page-footer">
            <div className="add-liquidity-page-footer-line-item-first">
              <div>
                <span className="add-liquidity-page-footer-line-item-texts">LP you will get</span>
                <img className="add-liquidity-page-icons" src={lp} alt="" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">{calcLpValues().lpReceived}</div>
            </div>
            <div className="add-liquidity-page-footer-line-item-second mobile-hidden">
              <div>
                <span className="add-liquidity-page-footer-line-item-texts">LP rewards</span>
                <img className="add-liquidity-page-icons" src={rew} alt="" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">% 0.2</div>
            </div>
            <div className="add-liquidity-page-footer-line-item-third">
              <div>
                <span className="add-liquidity-page-footer-line-item-texts">Pool Share</span>
                <img className="add-liquidity-page-icons" src={pct} alt="" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">% {calcLpValues().poolRate}</div>
            </div>
          </div>
          <div className="add-liquidity-button-content">
            <WalletButton
              text="Add Liquidity"
              onClick={() => {
                addLiquidityClick();
              }}
              disabled={
                Number(quoteAmount) <= 0 ||
                Number(tokenAmount) <= 0 ||
                !inputsIsValid()?.tokenIsValid ||
                !inputsIsValid()?.quoteIsValid
              }
              className="add-liquidity-button"
            />
          </div>
        </div>
      </Content>
    </div>
  );
};

export default AddLiquidity;
