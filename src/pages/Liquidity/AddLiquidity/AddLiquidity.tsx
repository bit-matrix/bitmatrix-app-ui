import { useCallback, useEffect, useMemo, useState } from 'react';
import { commitmentSign, convertion } from '@bitmatrix/lib';
import { CALL_METHOD, Pool } from '@bitmatrix/models';
import { usePoolContext, useSettingsContext, useWalletContext, useTxHistoryContext } from '../../../context';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTE_PATH } from '../../../enum/ROUTE_PATH';
import { Content } from 'rsuite';
import Decimal from 'decimal.js';
import { CommitmentStore } from '../../../model/CommitmentStore';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import { SwapFromTab } from '../../../components/SwapFromTab/SwapFromTab';
import { WalletButton } from '../../../components/WalletButton/WalletButton';
import { getAssetPrecession, getPrimaryPoolConfig, getAssetTicker, poolShareRound } from '../../../helper';
import FROM_AMOUNT_PERCENT from '../../../enum/FROM_AMOUNT_PERCENT';
import plus from '../../../images/plus.png';
import { AssetIcon } from '../../../components/AssetIcon/AssetIcon';
import LpIcon from '../../../components/base/Svg/Icons/Lp';
import PercentIcon from '../../../components/base/Svg/Icons/Percent';
import RewardIcon from '../../../components/base/Svg/Icons/Reward';
import { BackButton } from '../../../components/base/BackButton/BackButton';
import { notify } from '../../../components/utils/utils';
import { NumericalInput } from '../../../components/NumericalInput/NumericalInput';
import { Balance } from 'marina-provider';
import { lbtcAsset } from '../../../lib/liquid-dev/ASSET';
import { lpFeeTiers } from '@bitmatrix/lib/pool';
import { testnetConfig } from '../../../config/testnet';
import './AddLiquidity.scss';

type Props = {
  checkTxStatusWithIds: (txIds: string[]) => void;
};

const AddLiquidity: React.FC<Props> = ({ checkTxStatusWithIds }): JSX.Element => {
  const [quotePercent, setQuotePercent] = useState<FROM_AMOUNT_PERCENT>();
  const [tokenPercent, setTokenPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [pair1Value, setPair1Value] = useState<string>('');
  const [pair2Value, setPair2Value] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPool, setCurrentPool] = useState<Pool>();

  const { pools } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();
  const { txHistoryContext, setTxHistoryContext } = useTxHistoryContext();

  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const pl = pools.find((p) => p.id === id);
    setCurrentPool(pl);
  }, [id, pools]);

  const onChangeQuoteAmount = useCallback(
    (input: string) => {
      const inputNum = Number(input);

      if (currentPool && input !== '.') {
        const output = convertion.convertForLiquidityCtx(
          inputNum * Math.pow(10, getAssetPrecession(currentPool.quote, settingsContext.preferred_unit.text)),
          currentPool,
        );

        setPair1Value(input);

        setPair2Value(
          (
            output / Math.pow(10, getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text))
          ).toString(),
        );
        setQuotePercent(undefined);
      }
    },
    [currentPool, settingsContext.preferred_unit.text],
  );

  const onChangeTokenAmount = useCallback(
    (input: string) => {
      const inputNum = Number(input);

      if (currentPool && input !== '.') {
        const output = convertion.convertForLiquidityCtx(
          inputNum * Math.pow(10, getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text)),
          currentPool,
          true,
        );

        setPair2Value(input);

        setPair1Value(
          (
            output / Math.pow(10, getAssetPrecession(currentPool.quote, settingsContext.preferred_unit.text))
          ).toString(),
        );

        setQuotePercent(undefined);
      }
    },
    [currentPool, settingsContext.preferred_unit.text],
  );

  const calcAmountPercent = useCallback(
    (
      quotePercent: FROM_AMOUNT_PERCENT | undefined,
      tokenPercent: FROM_AMOUNT_PERCENT | undefined,
      balances: Balance[],
    ) => {
      if (currentPool && walletContext && balances.length > 0) {
        let inputAmount = '';

        const quoteTotalAmountInWallet = balances.find(
          (bl) => bl.asset.assetHash === currentPool.quote.assetHash,
        )?.amount;

        const tokenTotalAmountInWallet = balances.find(
          (bl) => bl.asset.assetHash === currentPool.token.assetHash,
        )?.amount;

        const primaryPoolConfig = getPrimaryPoolConfig(testnetConfig);

        const totalFee =
          primaryPoolConfig.baseFee.number +
          primaryPoolConfig.commitmentTxFee.number +
          primaryPoolConfig.defaultOrderingFee.number +
          primaryPoolConfig.serviceFee.number +
          1000;

        if (quoteTotalAmountInWallet && quoteTotalAmountInWallet > 0 && quotePercent) {
          const quoteAmount = quoteTotalAmountInWallet - totalFee;

          if (quoteAmount > 0) {
            if (currentPool.quote.assetHash === lbtcAsset.assetHash) {
              if (quotePercent === FROM_AMOUNT_PERCENT.ALL) {
                inputAmount = (quoteAmount / settingsContext.preferred_unit.value).toString();
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.HALF) {
                const quoteAmountHalf = Math.ceil(quoteAmount / 2);
                inputAmount = (quoteAmountHalf / settingsContext.preferred_unit.value).toString();
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.MIN) {
                inputAmount = (testnetConfig.minRemainingSupply / settingsContext.preferred_unit.value).toString();
              }
            } else {
              if (quotePercent === FROM_AMOUNT_PERCENT.ALL) {
                inputAmount = (quoteAmount / PREFERRED_UNIT_VALUE.LBTC).toFixed(currentPool.quote.precision);
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.HALF) {
                const quoteAmountHalf = Math.ceil(quoteAmount / 2);
                inputAmount = (quoteAmountHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(currentPool.quote.precision);
              }
              if (quotePercent === FROM_AMOUNT_PERCENT.MIN) {
                inputAmount = (testnetConfig.minRemainingSupply / PREFERRED_UNIT_VALUE.LBTC).toFixed(
                  currentPool.quote.precision,
                );
              }
            }
            onChangeQuoteAmount(inputAmount);
            setTokenPercent(undefined);
            setQuotePercent(quotePercent);
          }
        }

        if (tokenPercent && tokenTotalAmountInWallet) {
          const tokenAmount = tokenTotalAmountInWallet - totalFee;

          if (tokenAmount > 0) {
            if (currentPool.token.assetHash === lbtcAsset.assetHash) {
              if (tokenPercent === FROM_AMOUNT_PERCENT.ALL) {
                inputAmount = (tokenAmount / settingsContext.preferred_unit.value).toString();
              }
              if (tokenPercent === FROM_AMOUNT_PERCENT.HALF) {
                const tokenAmountInWalletHalf = Math.ceil(tokenAmount / 2);
                inputAmount = (tokenAmountInWalletHalf / settingsContext.preferred_unit.value).toString();
              }
              if (tokenPercent === FROM_AMOUNT_PERCENT.MIN) {
                inputAmount = (testnetConfig.minRemainingSupply / settingsContext.preferred_unit.value).toString();
              }
            } else {
              if (tokenPercent === FROM_AMOUNT_PERCENT.ALL) {
                inputAmount = (tokenTotalAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
              }
              if (tokenPercent === FROM_AMOUNT_PERCENT.HALF) {
                const tokenAmountInWalletHalf = tokenTotalAmountInWallet / 2;
                inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
              }
              if (tokenPercent === FROM_AMOUNT_PERCENT.MIN) {
                inputAmount = (testnetConfig.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
              }
            }
          }

          onChangeTokenAmount(inputAmount);
          setQuotePercent(undefined);
          setTokenPercent(tokenPercent);
        }
        if (!tokenPercent && !quotePercent) {
          onChangeTokenAmount('0');
          setQuotePercent(undefined);
          setTokenPercent(undefined);
        }
      }
    },
    [currentPool, onChangeQuoteAmount, onChangeTokenAmount, settingsContext.preferred_unit.value, walletContext],
  );

  const inputsIsValid = useCallback(() => {
    if (currentPool && walletContext) {
      let tokenIsValid = false;
      let quoteIsValid = false;

      if ((pair1Value && parseFloat(pair1Value) > 0) || (pair2Value && parseFloat(pair2Value) > 0)) {
        const quoteAssetId = currentPool.quote.assetHash;
        let quoteAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount || 0;

        const tokenAssetId = currentPool.token.assetHash;
        let tokenAmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount || 0;

        const primaryPoolConfig = getPrimaryPoolConfig(testnetConfig);

        const totalFee =
          primaryPoolConfig.baseFee.number +
          primaryPoolConfig.commitmentTxFee.number +
          primaryPoolConfig.defaultOrderingFee.number +
          primaryPoolConfig.serviceFee.number +
          1000;

        if (quoteAssetId === lbtcAsset.assetHash) {
          quoteAmountInWallet = quoteAmountInWallet - totalFee;
        } else if (tokenAssetId === lbtcAsset.assetHash) {
          tokenAmountInWallet = tokenAmountInWallet - totalFee;
        }

        const finalPair1Value =
          Number(pair1Value) * Math.pow(10, getAssetPrecession(currentPool.quote, settingsContext.preferred_unit.text));

        const finalPair2Value =
          Number(pair2Value) * Math.pow(10, getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text));

        if (finalPair1Value <= quoteAmountInWallet && quoteAmountInWallet > 0) {
          if (quoteAssetId === lbtcAsset.assetHash) {
            finalPair1Value < 500 ? (quoteIsValid = false) : (quoteIsValid = true);
          } else {
            quoteIsValid = true;
          }
        } else {
          quoteIsValid = false;
        }

        if (finalPair2Value <= Number(tokenAmountInWallet) && Number(tokenAmountInWallet) > 0) {
          if (tokenAssetId === lbtcAsset.assetHash) {
            finalPair2Value < 500 ? (tokenIsValid = false) : (tokenIsValid = true);
          } else {
            tokenIsValid = true;
          }
        } else {
          tokenIsValid = false;
        }

        return { tokenIsValid, quoteIsValid };
      }
    }

    return { tokenIsValid: true, quoteIsValid: true };
  }, [currentPool, pair1Value, pair2Value, settingsContext.preferred_unit.text, walletContext]);

  const addLiquidityClick = async () => {
    if (walletContext?.marina && currentPool) {
      const quoteAmountN = new Decimal(Number(pair1Value))
        .mul(Math.pow(10, getAssetPrecession(currentPool.quote, settingsContext.preferred_unit.text)))
        .toNumber();
      const tokenAmountN = new Decimal(Number(pair2Value))
        .mul(Math.pow(10, getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text)))
        .toNumber();

      if (currentPool) {
        setLoading(true);

        const addressInformation = await walletContext.marina.getNextChangeAddress();

        if (addressInformation.publicKey) {
          setPair1Value('');
          setPair2Value('');
          setQuotePercent(undefined);
          setTokenPercent(undefined);
          const primaryPoolConfig = getPrimaryPoolConfig(testnetConfig);

          let commitmentTxId = '';

          try {
            commitmentTxId = await commitmentSign.case3(
              walletContext.marina,
              quoteAmountN,
              tokenAmountN,
              currentPool,
              primaryPoolConfig,
              addressInformation.publicKey,
              lbtcAsset.assetHash,
              true,
            );
          } catch (error) {
            setLoading(false);
          }

          if (commitmentTxId && commitmentTxId !== '') {
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: quoteAmountN,
              quoteAsset: currentPool.quote,
              tokenAmount: tokenAmountN,
              tokenAsset: currentPool.token,
              lpAmount: new Decimal(calcLpValues().lpReceived).toNumber(),
              lpAsset: currentPool.lp.ticker,
              timestamp: new Date().valueOf(),
              errorMessage: undefined,
              completed: false,
              seen: false,
              method: CALL_METHOD.ADD_LIQUIDITY,
            };

            const newStoreData = [...txHistoryContext, tempTxData];
            const unconfirmedTxs = newStoreData.filter((utx) => utx.completed === false);
            const txIds = unconfirmedTxs.map((tx) => tx.txId);
            setTxHistoryContext(newStoreData);

            setLoading(false);

            checkTxStatusWithIds(txIds);
          }
        } else {
          notify('Commitment transaction could not be created.', 'Wallet Error : ', 'error');
          setLoading(false);
        }
      }
    }
  };

  const calcLpValues = useCallback(() => {
    if (currentPool && pair1Value !== '' && pair2Value !== '') {
      const quoteAmountN = new Decimal(Number(pair1Value))
        .mul(
          currentPool.quote.assetHash === lbtcAsset.assetHash
            ? settingsContext.preferred_unit.value
            : Math.pow(10, currentPool.quote.precision),
        )
        .toNumber();
      const tokenAmountN = new Decimal(Number(pair2Value))
        .mul(Math.pow(10, getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text)))
        .toNumber();

      const recipientValue = convertion.calcAddLiquidityRecipientValue(currentPool, quoteAmountN, tokenAmountN);

      return {
        lpReceived: (Number(recipientValue.lpReceived) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8),
        poolRate: poolShareRound(Number(recipientValue.poolRate) * 100),
      };
    }
    return { lpReceived: '0', poolRate: '0' };
  }, [currentPool, pair1Value, pair2Value, settingsContext.preferred_unit.text, settingsContext.preferred_unit.value]);

  const quoteTicker = useMemo(() => {
    if (currentPool) return getAssetTicker(currentPool?.quote, settingsContext.preferred_unit.text);
  }, [currentPool, settingsContext.preferred_unit.text]);

  const tokenTicker = useMemo(() => {
    if (currentPool) return getAssetTicker(currentPool?.token, settingsContext.preferred_unit.text);
  }, [currentPool, settingsContext.preferred_unit.text]);

  return (
    <div className="add-liquidity-page-main">
      <Content className="add-liquidity-page-content">
        {/* {loading && <Loader className="add-liquidity-page-loading" size="md" inverse center />} */}
        <BackButton
          buttonText="Add Liquidity"
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
          <div className="add-liquidity-main">
            <div
              className={`add-liquidity-item pt8 ${
                !inputsIsValid()?.quoteIsValid ? 'add-liquidity-invalid-content' : ''
              }`}
            >
              <SwapFromTab
                selectedFromAmountPercent={quotePercent}
                setselectedFromAmountPercent={(quotePercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) =>
                  calcAmountPercent(quotePercent, undefined, balances)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{quoteTicker} Liquidity</div>
                    {currentPool?.quote && (
                      <AssetIcon
                        className="add-liquidity-input-icons"
                        width="1.75rem"
                        height="1.75rem"
                        asset={currentPool?.quote.assetHash}
                      />
                    )}
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={pair1Value}
                    onChange={(inputValue) => {
                      onChangeQuoteAmount(inputValue);
                      setQuotePercent(undefined);
                    }}
                    decimalLength={
                      currentPool?.quote && getAssetPrecession(currentPool.quote, settingsContext.preferred_unit.text)
                    }
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
                selectedFromAmountPercent={tokenPercent}
                setselectedFromAmountPercent={(tokenPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) =>
                  calcAmountPercent(undefined, tokenPercent, balances)
                }
              />
              <div className="add-liquidity-item-content">
                <div className="add-liquidity-input-div">
                  <div className="add-liquidity-input-content">
                    <div className="add-liquidity-text">{tokenTicker} Liquidity</div>
                    {currentPool?.token && (
                      <AssetIcon
                        className="add-liquidity-input-icons"
                        width="1.75rem"
                        height="1.75rem"
                        asset={currentPool.token.assetHash}
                      />
                    )}
                  </div>
                  <NumericalInput
                    className="add-liquidity-input"
                    inputValue={pair2Value}
                    onChange={(inputValue) => {
                      onChangeTokenAmount(inputValue);
                      setTokenPercent(undefined);
                    }}
                    decimalLength={
                      currentPool?.token && getAssetPrecession(currentPool.token, settingsContext.preferred_unit.text)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="add-liquidity-page-footer">
            <div className="add-liquidity-page-footer-line-item-first">
              <div className="add-liquidity-text-icon-content">
                <span className="add-liquidity-page-footer-line-item-texts">LP you will get</span>
                <LpIcon className="add-liquidity-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">{calcLpValues().lpReceived}</div>
            </div>
            <div className="add-liquidity-page-footer-line-item-second mobile-hidden">
              <div className="add-liquidity-text-icon-content">
                <span className="add-liquidity-page-footer-line-item-texts">LP rewards</span>
                <RewardIcon className="add-liquidity-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">
                {Object.keys(lpFeeTiers)[currentPool?.lpFeeTierIndex.number || 0]}
              </div>
            </div>
            <div className="add-liquidity-page-footer-line-item-third">
              <div className="add-liquidity-text-icon-content">
                <span className="add-liquidity-page-footer-line-item-texts">Pool Share</span>
                <PercentIcon className="add-liquidity-input-icons" width="1.5rem" height="1.5rem" />
              </div>
              <div className="add-liquidity-page-footer-line-item-values">% {calcLpValues().poolRate}</div>
            </div>
          </div>
          <div className="add-liquidity-button-content">
            <WalletButton
              text={`Add ${quoteTicker} and ${tokenTicker}`}
              loading={loading}
              onClick={() => {
                addLiquidityClick();
              }}
              disabled={
                Number(pair1Value) <= 0 ||
                Number(pair2Value) <= 0 ||
                !inputsIsValid()?.tokenIsValid ||
                !inputsIsValid()?.quoteIsValid ||
                Number(calcLpValues().lpReceived) <= 0 ||
                loading
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
