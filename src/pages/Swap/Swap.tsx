import { useCallback, useEffect, useState } from 'react';
import Decimal from 'decimal.js';
import { Button, Content } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { Balance } from 'marina-provider';
import SWAP_WAY from '../../enum/SWAP_WAY';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { commitmentSign, validatePoolTx } from '@bitmatrix/lib';
import { CALL_METHOD, Pool } from '@bitmatrix/models';
import { CommitmentStore } from '../../model/CommitmentStore';
import {
  AssetModel,
  calculateUsdtPrice,
  getAssetPrecession,
  getAssetTicker,
  uniqueAssetListAll,
  uniqueMatchingAssetList,
} from '../../helper';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { notify } from '../../components/utils/utils';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import ArrowDownIcon from '../../components/base/Svg/Icons/ArrowDown';
import {
  usePoolContext,
  useWalletContext,
  useSettingsContext,
  usePoolConfigContext,
  useTxHistoryContext,
  useBtcPriceContext,
} from '../../context';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import ArrowDownIcon2 from '../../components/base/Svg/Icons/ArrowDown2';
import { AssetListModal } from '../../components/AssetListModal/AssetListModal';
import { lbtcAsset } from '../../lib/liquid-dev/ASSET';
import { convertForCtx2 } from '@bitmatrix/lib/convertion';
import './Swap.scss';

type Props = {
  checkTxStatusWithIds: (txIds: string[]) => void;
};

export const Swap: React.FC<Props> = ({ checkTxStatusWithIds }): JSX.Element => {
  const [swapWay, setSwapWay] = useState<SWAP_WAY>();
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [loading, setLoading] = useState<boolean>(false);

  const [fromAssetList, setFromAssetList] = useState<AssetModel[]>([]);
  const [toAssetList, setToAssetList] = useState<AssetModel[]>([]);

  const [fromAsset, setFromAsset] = useState<AssetModel>();
  const [toAsset, setToAsset] = useState<AssetModel>();

  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [amountWithSlippage, setAmountWithSlippage] = useState<number>(0);

  const [showPair1AssetListModal, setShowPair1AssetListModal] = useState<boolean>(false);
  const [showPair2AssetListModal, setShowPair2AssetListModal] = useState<boolean>(false);

  const [currentPool, setCurrentPool] = useState<Pool>();

  const { txHistoryContext, setTxHistoryContext } = useTxHistoryContext();

  const { pools } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();
  const { poolConfigContext } = usePoolConfigContext();
  const { btcPrice } = useBtcPriceContext();

  document.title = ROUTE_PATH_TITLE.SWAP;

  useEffect(() => {
    let unmounted = false;

    if (!unmounted && !currentPool) {
      const fromAssetListAll = uniqueAssetListAll(pools);
      const toAssetListAll = uniqueMatchingAssetList(pools, lbtcAsset.assetHash);

      setFromAsset(lbtcAsset);
      setFromAssetList(fromAssetListAll);
      setToAssetList(toAssetListAll);
    }

    return () => {
      unmounted = true;
    };
  }, [currentPool, pools]);

  useEffect(() => {
    if (fromAsset && toAsset) {
      const filteredPools = pools.filter(
        (pool) =>
          (pool.quote.assetHash === fromAsset.assetHash && pool.token.assetHash === toAsset.assetHash) ||
          (pool.quote.assetHash === toAsset.assetHash && pool.token.assetHash === fromAsset.assetHash),
      );

      const sortedPools = filteredPools.sort((a, b) => Number(b.token.value) - Number(a.token.value));

      setCurrentPool(sortedPools[0]);
    }
  }, [fromAsset, pools, toAsset]);

  const onChangeFromInput = useCallback(
    (input: string) => {
      if (input.length === 0) setToAmount('');

      let inputNum = Number(input);

      let methodCall;

      if (currentPool && poolConfigContext && Number(fromAmount) > 0 && fromAsset && toAsset) {
        inputNum = inputNum * Math.pow(10, getAssetPrecession(fromAsset, settingsContext.preferred_unit.text));

        const findPair1 = currentPool.quote.assetHash === fromAsset.assetHash;

        if (findPair1) {
          methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        } else {
          methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        }

        const output = validatePoolTx(inputNum, settingsContext.slippage, currentPool, methodCall);

        if (output.amount > 0) {
          const assetPrecision = getAssetPrecession(toAsset, settingsContext.preferred_unit.text);

          setAmountWithSlippage(output.amountWithSlipapge / Math.pow(10, assetPrecision));
          setToAmount((output.amount / Math.pow(10, assetPrecision)).toString());
        } else {
          setAmountWithSlippage(0);
        }
      } else {
        setAmountWithSlippage(0);
      }
    },
    [
      currentPool,
      fromAmount,
      fromAsset,
      poolConfigContext,
      settingsContext.preferred_unit.text,
      settingsContext.slippage,
      toAsset,
    ],
  );

  const onChangeToInput = useCallback(
    (input: string) => {
      if (input.length === 0) setFromAmount('');

      let inputNum = Number(input);

      let methodCall;

      if (currentPool && Number(toAmount) > 0 && toAsset && fromAsset) {
        inputNum = inputNum * Math.pow(10, getAssetPrecession(toAsset, settingsContext.preferred_unit.text));

        const findPair1 = currentPool.quote.assetHash === toAsset.assetHash;

        if (findPair1) {
          methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        } else {
          methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        }

        const output = convertForCtx2(inputNum, settingsContext.slippage, currentPool, methodCall);

        if (output.amount > 0) {
          const assetPrecision = getAssetPrecession(toAsset, settingsContext.preferred_unit.text);

          setAmountWithSlippage(output.amountWithSlipapge / Math.pow(10, assetPrecision));
          setFromAmount((output.amount / Math.pow(10, assetPrecision)).toString());
        } else {
          setAmountWithSlippage(0);
        }
      } else {
        setAmountWithSlippage(0);
      }
    },
    [currentPool, fromAsset, settingsContext.preferred_unit.text, settingsContext.slippage, toAmount, toAsset],
  );

  useEffect(() => {
    if (currentPool && poolConfigContext) {
      if (swapWay === SWAP_WAY.FROM) {
        onChangeFromInput(fromAmount);
      } else {
        onChangeToInput(toAmount);
      }
    }
  }, [currentPool, fromAmount, onChangeFromInput, onChangeToInput, poolConfigContext, swapWay, toAmount]);

  const calcAmountPercent = (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) => {
    if (pools.length > 0 && poolConfigContext && walletContext && balances.length > 0) {
      let inputAmount = '';
      setSwapWay(SWAP_WAY.FROM);

      const totalAmountInWallet = balances.find((bl) => bl.asset.assetHash === fromAsset?.assetHash)?.amount || 0;

      if (totalAmountInWallet > 0 && fromAsset) {
        const totalFee =
          poolConfigContext.baseFee.number +
          poolConfigContext.commitmentTxFee.number +
          poolConfigContext.defaultOrderingFee.number +
          poolConfigContext.serviceFee.number +
          1000;

        let quoteAmount = totalAmountInWallet;

        if (fromAsset.assetHash === lbtcAsset.assetHash) {
          quoteAmount = quoteAmount - totalFee;
        }
        if (quoteAmount > 0) {
          const assetPrecision = getAssetPrecession(fromAsset, settingsContext.preferred_unit.text);

          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
            inputAmount = (quoteAmount / Math.pow(10, assetPrecision)).toString();
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
            const quoteAmountHalf = Math.ceil(quoteAmount / 2);
            inputAmount = (quoteAmountHalf / Math.pow(10, assetPrecision)).toString();
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
            inputAmount = (poolConfigContext.minRemainingSupply / Math.pow(10, assetPrecision)).toString();
          }

          setFromAmount(inputAmount);
          setSelectedFromAmountPercent(newFromAmountPercent);
        }
      }
    }
  };

  const inputIsValid = useCallback(() => {
    if (currentPool && pools.length > 0 && poolConfigContext && walletContext) {
      let inputAmount = 0;
      let isValid = false;

      const inputFromValue = Number(fromAmount);

      if (inputFromValue > 0) {
        const pair1AssetHash = fromAsset?.assetHash || '';
        const pair1AmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === pair1AssetHash)?.amount;

        if (pair1AmountInWallet && pair1AmountInWallet > 0 && fromAsset) {
          const assetPrecision = getAssetPrecession(fromAsset, settingsContext.preferred_unit.text);
          if (fromAsset.assetHash === lbtcAsset.assetHash) {
            const totalFee =
              poolConfigContext.baseFee.number +
              poolConfigContext.commitmentTxFee.number +
              poolConfigContext.defaultOrderingFee.number +
              poolConfigContext.serviceFee.number +
              1000;

            inputAmount = (pair1AmountInWallet - totalFee) / Math.pow(10, assetPrecision);
          } else {
            inputAmount = pair1AmountInWallet / Math.pow(10, assetPrecision);
          }
        }

        if (inputFromValue <= inputAmount && inputAmount > 0) {
          isValid = true;
        } else {
          isValid = false;
        }
        return isValid;
      }
    }
    return true;
  }, [
    currentPool,
    pools.length,
    poolConfigContext,
    walletContext,
    fromAmount,
    fromAsset,
    settingsContext.preferred_unit.text,
  ]);

  const swapRouteChange = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setFromAmount('');
    setToAmount('');

    if (swapWay === SWAP_WAY.FROM) setSwapWay(SWAP_WAY.TO);
    else setSwapWay(SWAP_WAY.FROM);

    setSelectedFromAmountPercent(undefined);
  };

  const swapClick = async () => {
    if (walletContext?.marina) {
      let methodCall;
      let numberFromAmount = 0;
      let numberToAmount = 0;

      if (currentPool && poolConfigContext && toAsset && fromAsset) {
        const fromIsQuote = currentPool.quote.assetHash === fromAsset.assetHash;
        const pair1Precision = getAssetPrecession(fromAsset, settingsContext.preferred_unit.text);
        const pair2Precision = getAssetPrecession(toAsset, settingsContext.preferred_unit.text);

        if (fromIsQuote) {
          methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
          numberFromAmount = new Decimal(Number(fromAmount)).mul(Math.pow(10, pair1Precision)).toNumber();
          numberToAmount = new Decimal(amountWithSlippage).mul(Math.pow(10, pair2Precision)).toNumber();
        } else {
          methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
          numberFromAmount = new Decimal(Number(fromAmount)).mul(Math.pow(10, pair1Precision)).toNumber();
          numberToAmount = new Decimal(amountWithSlippage).mul(Math.pow(10, pair2Precision)).toNumber();
        }

        setLoading(true);

        const addressInformation = await walletContext.marina.getNextChangeAddress();

        if (addressInformation.publicKey) {
          // setSwapWay(undefined);
          // setFromAmount('');
          // setToAmount('');
          // setSelectedFromAmountPercent(undefined);

          let commitmentTxId = '';

          if (fromIsQuote) {
            try {
              commitmentTxId = await commitmentSign.case1(
                walletContext.marina,
                numberFromAmount,
                numberToAmount,
                currentPool,
                poolConfigContext,
                addressInformation.publicKey,
                lbtcAsset.assetHash,
                true,
              );
            } catch (error) {
              setLoading(false);
            }
          } else {
            try {
              commitmentTxId = await commitmentSign.case2(
                walletContext.marina,
                numberFromAmount,
                numberToAmount,
                currentPool,
                poolConfigContext,
                addressInformation.publicKey,
                lbtcAsset.assetHash,
                true,
              );
            } catch (error) {
              setLoading(false);
            }
          }

          if (commitmentTxId !== '') {
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberFromAmount : numberToAmount,
              quoteAsset: currentPool.quote,
              tokenAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberToAmount : numberFromAmount,
              tokenAsset: currentPool.token,
              timestamp: new Date().valueOf(),
              errorMessage: undefined,
              completed: false,
              seen: false,
              method: methodCall,
            };

            const newStoreData = [...txHistoryContext, tempTxData];
            const unconfirmedTxs = newStoreData.filter((utx) => utx.completed === false);
            const txIds = unconfirmedTxs.map((tx) => tx.txId);
            setTxHistoryContext(newStoreData);

            setLoading(false);
            setSelectedFromAmountPercent(undefined);
            checkTxStatusWithIds(txIds);
          } else {
            notify('Commitment transaction could not be created.', 'Bitmatrix Error : ');
            setLoading(false);
          }
        } else {
          notify('Funding transaction could not be created.', 'Wallet Error : ', 'error');
          setLoading(false);
        }
      } else {
        notify('Pool Error', 'Error : ', 'error');
        setLoading(false);
      }
    } else {
      notify('Wallet Error', 'Error : ', 'error');
      setLoading(false);
    }
  };

  const swapButtonDisabled =
    Number(toAmount) <= 0 ||
    !inputIsValid() ||
    fromAssetList?.length === 0 ||
    toAssetList?.length === 0 ||
    !fromAmount ||
    !toAmount ||
    loading;

  const infoMessage = useCallback((): string => {
    const config = poolConfigContext;
    const totalFee =
      config.baseFee.number +
      config.commitmentTxFee.number +
      config.defaultOrderingFee.number +
      config.serviceFee.number;

    const currentFeeUsdtPrice = calculateUsdtPrice(btcPrice, totalFee).toFixed(2);

    // eslint-disable-next-line no-useless-concat
    return 'Network fee ' + totalFee + ' sats ' + '($' + currentFeeUsdtPrice + ')';
  }, [poolConfigContext, btcPrice]);

  const fromAssetListClick = () => {
    setShowPair1AssetListModal(true);
    if (toAsset) {
      const fromAssetListAll = uniqueMatchingAssetList(pools, toAsset.assetHash);
      setFromAssetList(fromAssetListAll);
    }
  };

  const toAssetListClick = () => {
    setShowPair2AssetListModal(true);
    if (fromAsset) {
      const toAssetListAll = uniqueMatchingAssetList(pools, fromAsset.assetHash);
      setToAssetList(toAssetListAll);
    }
  };

  return (
    <div className="swap-page-main">
      <Content className="swap-page-main-content">
        <div className="swap-page-layout">
          <div className="swap-page-content">
            <div className={`from-content pt8 ${!inputIsValid() ? 'invalid-content' : ''}`}>
              <SwapFromTab
                selectedFromAmountPercent={selectedFromAmountPercent}
                setselectedFromAmountPercent={calcAmountPercent}
              />

              <div className="from-input-content">
                <div className="from-amount-div">
                  <div className="from-text">From</div>
                  <NumericalInput
                    className="from-input"
                    inputValue={fromAmount}
                    onChange={(inputValue) => {
                      if (inputValue === '.') return;

                      setFromAmount(inputValue);
                      setSelectedFromAmountPercent(undefined);
                      setSwapWay(SWAP_WAY.FROM);
                    }}
                    decimalLength={fromAsset && getAssetPrecession(fromAsset, settingsContext.preferred_unit.text)}
                  />
                </div>
                <div className="asset-button-content">
                  <Button
                    appearance="default"
                    className={`asset-button ${fromAsset?.assetHash && 'asset-button-selected'}`}
                    onClick={fromAssetListClick}
                  >
                    {fromAsset ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={fromAsset.assetHash}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{getAssetTicker(fromAsset, settingsContext.preferred_unit.text)}</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    ) : (
                      <div className="asset-button-default-text-container">
                        <div className="asset-button-default-text">Select an asset</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="swap-arrow-icon" onClick={swapRouteChange}>
              <ArrowDownIcon width="1.25rem" height="1.25rem" />
            </div>

            <div className="from-content">
              <div className="from-input-content">
                <div className="from-amount-div">
                  <div className="from-text">To</div>
                  <NumericalInput
                    className="from-input"
                    inputValue={toAmount}
                    onChange={(inputValue) => {
                      if (inputValue === '.') return;
                      setSelectedFromAmountPercent(undefined);
                      setToAmount(inputValue);
                      setSwapWay(SWAP_WAY.TO);
                    }}
                    decimalLength={toAsset && getAssetPrecession(toAsset, settingsContext.preferred_unit.text)}
                  />
                </div>
                <div className="asset-button-content">
                  <Button
                    appearance="default"
                    className={`asset-button ${toAsset?.assetHash && 'asset-button-selected'}`}
                    onClick={toAssetListClick}
                  >
                    {toAsset ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={toAsset.assetHash}
                          className="create-new-pool-lbtc-icon"
                          width="1.5rem"
                          height="1.5rem"
                        />
                        <div>{getAssetTicker(toAsset, settingsContext.preferred_unit.text)}</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    ) : (
                      <div className="asset-button-default-text-container">
                        <div className="asset-button-default-text">Select an asset</div>
                        <ArrowDownIcon2 className="asset-arrow-icon" width="0.75rem" height="0.75rem" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <WalletButton
              text="Swap"
              onClick={() => {
                swapClick();
              }}
              loading={loading}
              disabled={swapButtonDisabled}
            />
          </div>
        </div>
        <Info content={infoMessage()} />
        <AssetListModal
          show={showPair1AssetListModal}
          selectedAsset={fromAsset}
          close={() => {
            setShowPair1AssetListModal(false);
          }}
          onSelectAsset={(asset) => {
            setFromAsset(asset);
            setFromAmount('');
            setToAmount('');
            setSelectedFromAmountPercent(undefined);
            setShowPair1AssetListModal(false);
          }}
          assetList={fromAssetList}
        />
        <AssetListModal
          show={showPair2AssetListModal}
          close={() => {
            setShowPair2AssetListModal(false);
          }}
          selectedAsset={toAsset}
          onSelectAsset={(asset) => {
            setToAsset(asset);
            setToAmount('');
            setFromAmount('');
            setShowPair2AssetListModal(false);
          }}
          assetList={toAssetList}
        />
      </Content>
    </div>
  );
};
