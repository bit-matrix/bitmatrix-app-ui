/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect, useRef, useState } from 'react';
import Decimal from 'decimal.js';
import { Button, Content } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { Balance } from 'marina-provider';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import SWAP_WAY from '../../enum/SWAP_WAY';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { convertion, commitmentSign } from '@bitmatrix/lib';
import { CALL_METHOD, Pool, BmConfig, PAsset } from '@bitmatrix/models';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import {
  AssetModel,
  getAssetPrecession,
  getAssetTicker,
  uniqueAssetListAll,
  uniqueMatchingAssetList,
  usePrevious,
} from '../../helper';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import { notify } from '../../components/utils/utils';
import { NumericalInput } from '../../components/NumericalInput/NumericalInput';
import ArrowDownIcon from '../../components/base/Svg/Icons/ArrowDown';
import { usePoolContext, useWalletContext, useSettingsContext, usePoolConfigContext } from '../../context';
import { AssetIcon } from '../../components/AssetIcon/AssetIcon';
import ArrowDownIcon2 from '../../components/base/Svg/Icons/ArrowDown2';
import { AssetListModal } from '../../components/AssetListModal/AssetListModal';
import { lbtcAsset } from '../../lib/liquid-dev/ASSET';
import { TESTNET_ASSET_ID } from '../../lib/liquid-dev/ASSET_ID';
import './Swap.scss';

type Props = {
  checkTxStatusWithIds: () => void;
};

export const Swap2: React.FC<Props> = ({ checkTxStatusWithIds }): JSX.Element => {
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

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV4');

  const { pools } = usePoolContext();
  const { walletContext } = useWalletContext();
  const { settingsContext } = useSettingsContext();
  const { poolConfigContext } = usePoolConfigContext();

  document.title = ROUTE_PATH_TITLE.SWAP;

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      console.log('kaç kez');
      const fromAssetListAll = uniqueAssetListAll(pools);
      const toAssetListAll = uniqueMatchingAssetList(pools, lbtcAsset.hash);

      setFromAsset(lbtcAsset);
      setFromAssetList(fromAssetListAll);
      setToAssetList(toAssetListAll);
    }

    return () => {
      unmounted = true;
    };
  }, [pools]);

  // const findCurrentPool = useCallback((pools: Pool[], up?: PAsset, down?: PAsset) => {
  //   if (up && down) {
  //     const filteredPools = pools.filter(
  //       (pool) =>
  //         (pool.quote.ticker === up.ticker || pool.quote.ticker === down.ticker) &&
  //         (pool.token.ticker === up.ticker || pool.token.ticker === down.ticker),
  //     );

  //     if (filteredPools.length === 0) setPairAsset({ up, down: undefined });

  //     const sortedPools = filteredPools.sort((a, b) => b.tokenPrice - a.tokenPrice);

  //     if (filteredPools.length > 1) {
  //       setCurrentPool(sortedPools[0]);
  //     } else {
  //       setCurrentPool(filteredPools[0]);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (prevPairAsset?.up !== pairAsset.up || prevPairAsset?.down !== pairAsset.down) {
  //     let pair1AssetList = [];
  //     let pair2AssetList = [];

  //     if (pairAsset.up?.hash === TESTNET_ASSET_ID.USDT) {
  //       pair1AssetList = uniqueAssetListAll(pools);
  //       pair2AssetList = uniqueAssetListAll(pools);
  //     } else if (pairAsset.down?.hash === TESTNET_ASSET_ID.USDT) {
  //       pair1AssetList = uniqueAssetListAll(pools);
  //       pair2AssetList = uniqueMatchingAssetList(pools, pairAsset.up?.hash || '');
  //     } else {
  //       pair1AssetList = uniqueMatchingAssetList(pools, pairAsset.down?.hash || '');
  //       pair2AssetList = uniqueAssetListAll(pools);
  //     }
  //     setAssetList({ pair1AssetList, pair2AssetList });
  //   }
  // }, [assetList, pairAsset.down, pairAsset.up, pools, prevPairAsset]);

  // useEffect(() => {
  //   if (currentPool && poolConfigContext && pairAsset) {
  //     if (swapWay === SWAP_WAY.FROM) {
  //       onChangeFromInput(currentPool, poolConfigContext, pairAsset.up?.value || '');
  //     } else {
  //       onChangeToInput(currentPool, poolConfigContext, pairAsset.down?.value || '');
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPool, poolConfigContext, swapWay, pairAsset.down?.value, pairAsset.up?.value]);

  // const onChangeFromInput = useCallback(
  //   (current_pool: Pool, pool_config: BmConfig, input: string) => {
  //     let inputNum = Number(input);

  //     let methodCall;

  //     if (current_pool && pool_config && Number(pairAsset.up?.value) > 0) {
  //       if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
  //         inputNum = inputNum * settingsContext.preferred_unit.value;
  //       } else {
  //         inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
  //       }

  //       if (pairAsset.up && pairAsset.up.isQuote) {
  //         methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  //       } else {
  //         methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  //       }

  //       const output = convertion.convertForCtx(
  //         inputNum,
  //         settingsContext.slippage,
  //         current_pool,
  //         pool_config,
  //         methodCall,
  //       );

  //       if (output.amount > 0) {
  //         if (pairAsset.up && pairAsset.up.isQuote) {
  //           if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
  //             setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
  //             setPairAsset({
  //               ...pairAsset,
  //               down: { ...pairAsset.down, value: (output.amount / PREFERRED_UNIT_VALUE.LBTC).toFixed(2) } as PAsset,
  //             });
  //           } else {
  //             setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
  //             setPairAsset({
  //               ...pairAsset,
  //               down: {
  //                 ...pairAsset.down,
  //                 value: (output.amount / settingsContext.preferred_unit.value).toString(),
  //               } as PAsset,
  //             });
  //           }
  //         } else {
  //           setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
  //           setPairAsset({
  //             ...pairAsset,
  //             down: {
  //               ...pairAsset.down,
  //               value: (output.amount / settingsContext.preferred_unit.value).toString(),
  //             } as PAsset,
  //           });
  //         }
  //       } else {
  //         setPairAsset({
  //           ...pairAsset,
  //           down: { ...pairAsset.down, value: '' } as PAsset,
  //         });
  //         setAmountWithSlippage(0);
  //       }
  //     } else {
  //       setPairAsset({
  //         ...pairAsset,
  //         down: { ...pairAsset.down, value: '' } as PAsset,
  //       });
  //       setAmountWithSlippage(0);
  //     }
  //   },
  //   [pairAsset, settingsContext.preferred_unit.value, settingsContext.slippage],
  // );

  // const onChangeToInput = useCallback(
  //   (current_pool: Pool, pool_config: BmConfig, input: string) => {
  //     let inputNum = Number(input);

  //     let methodCall;

  //     if (current_pool && pool_config && Number(pairAsset.down?.value) > 0) {
  //       if (pairAsset.down?.ticker === SWAP_ASSET.LBTC) {
  //         inputNum = inputNum * settingsContext.preferred_unit.value;
  //       } else {
  //         inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
  //       }

  //       if (pairAsset.down && !pairAsset.down.isQuote) {
  //         methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  //       } else {
  //         methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  //       }

  //       const output = convertion.convertForCtx2(
  //         inputNum,
  //         settingsContext.slippage,
  //         current_pool,
  //         pool_config,
  //         methodCall,
  //       );

  //       if (output.amount > 0) {
  //         if (!pairAsset.up?.isQuote) {
  //           if (pairAsset.down?.ticker === SWAP_ASSET.LBTC) {
  //             setAmountWithSlippage(output.amountWithSlipapge / settingsContext.preferred_unit.value);
  //             setPairAsset({
  //               ...pairAsset,
  //               up: { ...pairAsset.up, value: (output.amount / PREFERRED_UNIT_VALUE.LBTC).toFixed(2) } as PAsset,
  //             });
  //           } else {
  //             setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
  //             setPairAsset({
  //               ...pairAsset,
  //               up: {
  //                 ...pairAsset.up,
  //                 value: (output.amount / settingsContext.preferred_unit.value).toString(),
  //               } as PAsset,
  //             });
  //           }
  //         } else {
  //           setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
  //           setPairAsset({
  //             ...pairAsset,
  //             up: {
  //               ...pairAsset.up,
  //               value: (output.amount / settingsContext.preferred_unit.value).toString(),
  //             },
  //           });
  //         }
  //       } else {
  //         setPairAsset({ ...pairAsset, up: { ...pairAsset.up, value: '' } as PAsset });
  //         setAmountWithSlippage(0);
  //       }
  //     } else {
  //       setPairAsset({ ...pairAsset, up: { ...pairAsset.up, value: '' } as PAsset });
  //       setAmountWithSlippage(0);
  //     }
  //   },
  //   [pairAsset, settingsContext.preferred_unit.value, settingsContext.slippage],
  // );

  const calcAmountPercent = (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined, balances: Balance[]) => {
    if (pools.length > 0 && poolConfigContext && walletContext && balances.length > 0) {
      let inputAmount = '';
      setSwapWay(SWAP_WAY.FROM);
      const totalAmountInWallet = balances.find((bl) => bl.asset.assetHash === fromAsset?.hash)?.amount || 0;

      if (totalAmountInWallet > 0) {
        if (fromAsset?.ticker === SWAP_ASSET.LBTC) {
          const totalFee =
            poolConfigContext.baseFee.number +
            poolConfigContext.commitmentTxFee.number +
            poolConfigContext.defaultOrderingFee.number +
            poolConfigContext.serviceFee.number +
            1000;
          const quoteAmount = totalAmountInWallet - totalFee;

          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
            inputAmount = (quoteAmount / settingsContext.preferred_unit.value).toString();
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
            const quoteAmountHalf = Math.ceil(quoteAmount / 2);
            inputAmount = (quoteAmountHalf / settingsContext.preferred_unit.value).toString();
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
            inputAmount = (poolConfigContext.minRemainingSupply / settingsContext.preferred_unit.value).toString();
          }
        } else {
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
            inputAmount = (totalAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
            const tokenAmountInWalletHalf = totalAmountInWallet / 2;
            inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
          if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
            inputAmount = (poolConfigContext.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
          }
        }

        setFromAmount(inputAmount);
        setSelectedFromAmountPercent(newFromAmountPercent);
      }
    }
  };

  const inputIsValid = useCallback(() => {
    if (currentPool && pools.length > 0 && poolConfigContext && walletContext) {
      let inputAmount = 0;
      let isValid = false;

      const inputFromValue = Number(fromAmount);

      if (inputFromValue > 0) {
        const pair1AssetHash = fromAsset?.hash || '';
        const pair1AmountInWallet = walletContext.balances.find((bl) => bl.asset.assetHash === pair1AssetHash)?.amount;

        if (pair1AmountInWallet && pair1AmountInWallet > 0) {
          if (fromAsset?.ticker === SWAP_ASSET.LBTC) {
            const totalFee =
              poolConfigContext.baseFee.number +
              poolConfigContext.commitmentTxFee.number +
              poolConfigContext.defaultOrderingFee.number +
              poolConfigContext.serviceFee.number +
              1000;

            inputAmount = (pair1AmountInWallet - totalFee) / settingsContext.preferred_unit.value;
          } else {
            inputAmount = Number((pair1AmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2));
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
    fromAsset?.hash,
    fromAsset?.ticker,
    settingsContext.preferred_unit.value,
  ]);

  // const assetOnChange = (asset: PAsset, isFrom = true) => {
  //   if (isFrom) {
  //     if (pairAsset.up?.ticker !== asset.ticker) {
  //       if (pairAsset.down) {
  //         if (pairAsset.down?.ticker === asset.ticker) {
  //           setPairAsset({ up: { ...asset, value: '' }, down: undefined });
  //           findCurrentPool(pools, asset, pairAsset.up);
  //         } else {
  //           setPairAsset({ ...pairAsset, up: { ...asset, value: '' } });
  //           findCurrentPool(pools, asset, pairAsset.down);
  //         }
  //       } else {
  //         setPairAsset({ ...pairAsset, up: { ...asset, value: '' } });
  //       }
  //     }
  //   } else {
  //     if (pairAsset.down?.ticker !== asset.ticker) {
  //       if (pairAsset.up) {
  //         if (pairAsset.up?.ticker === asset.ticker) {
  //           setPairAsset({ up: undefined, down: { ...asset, value: '' } });
  //           findCurrentPool(pools, pairAsset.down, asset);
  //         } else {
  //           setPairAsset({ ...pairAsset, down: { ...asset, value: '' } });
  //           findCurrentPool(pools, pairAsset.up, asset);
  //         }
  //       } else {
  //         setPairAsset({ ...pairAsset, down: { ...asset, value: '' } });
  //       }
  //     }
  //   }
  // };

  const swapRouteChange = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);

    // setAssetList({ quote: assetList?.token, token: assetList?.quote });
    setSelectedFromAmountPercent(undefined);
  };

  // const swapClick = async () => {
  //   if (walletContext?.marina) {
  //     let methodCall;
  //     let numberFromAmount = 0;
  //     let numberToAmount = 0;

  //     if (currentPool && poolConfigContext) {
  //       if (pairAsset.up?.isQuote) {
  //         if (pairAsset.up?.ticker === SWAP_ASSET.LBTC) {
  //           methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  //           numberFromAmount = new Decimal(Number(pairAsset.up.value))
  //             .mul(settingsContext.preferred_unit.value)
  //             .toNumber();
  //           numberToAmount = new Decimal(amountWithSlippage).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
  //         } else {
  //           methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  //           numberFromAmount = new Decimal(Number(pairAsset.up?.value)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
  //           numberToAmount = new Decimal(amountWithSlippage).mul(settingsContext.preferred_unit.value).toNumber();
  //         }
  //       } else {
  //         methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  //         numberFromAmount = new Decimal(Number(pairAsset.up?.value)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
  //         numberToAmount = new Decimal(amountWithSlippage).mul(settingsContext.preferred_unit.value).toNumber();
  //       }

  //       setLoading(true);

  //       const addressInformation = await walletContext.marina.getNextChangeAddress();

  //       if (addressInformation.publicKey) {
  //         setSwapWay(undefined);
  //         setPairAsset({
  //           up: { ...pairAsset.up, value: '' } as PAsset,
  //           down: { ...pairAsset.down, value: '' } as PAsset,
  //         });
  //         setSelectedFromAmountPercent(undefined);

  //         let commitmentTxId = '';

  //         console.log(numberToAmount);

  //         if (pairAsset.up?.isQuote) {
  //           try {
  //             commitmentTxId = await commitmentSign.case1(
  //               walletContext.marina,
  //               numberFromAmount,
  //               numberToAmount,
  //               currentPool,
  //               poolConfigContext,
  //               addressInformation.publicKey,
  //             );
  //           } catch (error) {
  //             setLoading(false);
  //           }
  //         } else {
  //           try {
  //             commitmentTxId = await commitmentSign.case2(
  //               walletContext.marina,
  //               numberFromAmount,
  //               numberToAmount,
  //               currentPool,
  //               poolConfigContext,
  //               addressInformation.publicKey,
  //             );
  //           } catch (error) {
  //             setLoading(false);
  //           }
  //         }

  //         if (commitmentTxId !== '') {
  //           const tempTxData: CommitmentStore = {
  //             txId: commitmentTxId,
  //             quoteAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberFromAmount : numberToAmount,
  //             quoteAsset: currentPool.quote.ticker,
  //             tokenAmount: methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN ? numberToAmount : numberFromAmount,
  //             tokenAsset: currentPool.token.ticker,
  //             timestamp: new Date().valueOf(),
  //             errorMessage: undefined,
  //             completed: false,
  //             seen: false,
  //             method: methodCall,
  //           };

  //           const storeOldData = getLocalData() || [];

  //           const newStoreData = [...storeOldData, tempTxData];

  //           setLocalData(newStoreData);

  //           setLoading(false);

  //           checkTxStatusWithIds();
  //         } else {
  //           notify('Commitment transaction could not be created.', 'Bitmatrix Error : ');
  //           setLoading(false);
  //         }
  //       } else {
  //         notify('Funding transaction could not be created.', 'Wallet Error : ', 'error');
  //         setLoading(false);
  //       }
  //     } else {
  //       notify('Pool Error', 'Error : ', 'error');
  //       setLoading(false);
  //     }
  //   } else {
  //     notify('Wallet Error', 'Error : ', 'error');
  //     setLoading(false);
  //   }
  // };

  // const swapButtonDisabled =
  //   Number(pairAsset.down?.value) <= 0 ||
  //   !inputIsValid() ||
  //   assetList?.pair1AssetList?.length === 0 ||
  //   assetList?.pair2AssetList?.length === 0 ||
  //   !pairAsset.up ||
  //   !pairAsset.down;

  const infoMessage = useCallback((): string => {
    if (poolConfigContext && currentPool && pools.length > 0) {
      const config = poolConfigContext;
      const totalFee =
        config.baseFee.number +
        config.commitmentTxFee.number +
        config.defaultOrderingFee.number +
        config.serviceFee.number;

      const currentUsdtPrice = (
        (Number(currentPool.token.value) / Number(currentPool.quote.value) / PREFERRED_UNIT_VALUE.LBTC) *
        totalFee
      ).toFixed(2);

      return 'Network fee ' + totalFee + ' sats ' + '($' + currentUsdtPrice + ')';
    }

    return 'Network fee 801 sats';
  }, [poolConfigContext, currentPool, pools]);

  const fromAssetListClick = () => {
    setShowPair1AssetListModal(true);
    if (toAsset) {
      const fromAssetListAll = uniqueMatchingAssetList(pools, toAsset.hash);
      setFromAssetList(fromAssetListAll);
    }
  };

  const toAssetListClick = () => {
    setShowPair2AssetListModal(true);
    if (fromAsset) {
      const toAssetListAll = uniqueMatchingAssetList(pools, fromAsset.hash);
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
                    decimalLength={getAssetPrecession(
                      fromAsset?.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${fromAsset?.hash && 'asset-button-selected'}`}
                    onClick={fromAssetListClick}
                  >
                    {fromAsset ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={fromAsset.hash}
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
                      setSwapWay(SWAP_WAY.TO);
                    }}
                    decimalLength={getAssetPrecession(
                      toAsset?.ticker as SWAP_ASSET,
                      settingsContext.preferred_unit.text,
                    )}
                  />
                </div>
                <div>
                  <Button
                    appearance="default"
                    className={`asset-button ${toAsset?.hash && 'asset-button-selected'}`}
                    onClick={toAssetListClick}
                  >
                    {toAsset ? (
                      <div className="create-new-pool-img-content">
                        <AssetIcon
                          asset={toAsset.hash}
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
                // swapClick();
              }}
              loading={loading}
              // disabled={swapButtonDisabled}
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
