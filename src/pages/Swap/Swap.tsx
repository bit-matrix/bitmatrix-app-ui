/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react';
import { Notification, Content } from 'rsuite';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { SwapAssetList } from '../../components/SwapAssetList/SwapAssetList';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { useContext } from 'react';
import SettingsContext from '../../context/SettingsContext';
import { commitmentTx, fundingTx, api, convertion } from '@bitmatrix/lib';
import { CALL_METHOD } from '@bitmatrix/models';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CommitmentStore } from '../../model/CommitmentStore';
import Decimal from 'decimal.js';
import { WalletButton } from '../../components/WalletButton/WalletButton';
import './Swap.scss';

export const Swap = (): JSX.Element => {
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>();

  const [selectedAsset, setSelectedAsset] = useState<{
    from: SWAP_ASSET;
    to: SWAP_ASSET;
  }>({ from: SWAP_ASSET.LBTC, to: SWAP_ASSET.USDT });

  const [inputFromAmount, setInputFromAmount] = useState<string>('0.0');

  const [inputToAmount, setInputToAmount] = useState<string>('0');

  const [amountWithSlippage, setAmountWithSlippage] = useState<number>(0);

  const { setLocalData, getLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const { payloadData } = useContext(SettingsContext);

  document.title = ROUTE_PATH_TITLE.SWAP;

  const onChangeFromInput = (input: string) => {
    let inputNum = Number(input);

    if (payloadData.pools && payloadData.pool_config) {
      let methodCall;

      if (selectedAsset.from === SWAP_ASSET.LBTC) {
        inputNum = inputNum * payloadData.preferred_unit.value;
        methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
      } else {
        inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
        methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
      }

      const output = convertion.convertForCtx(
        inputNum,
        payloadData.slippage,
        payloadData.pools[0],
        payloadData.pool_config,
        methodCall,
      );

      console.log('1', output);

      if (selectedAsset.from === SWAP_ASSET.LBTC) {
        setInputToAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toString());
        setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
      } else {
        setInputToAmount((output.amount / payloadData.preferred_unit.value).toString());
        setAmountWithSlippage(output.amountWithSlipapge / payloadData.preferred_unit.value);
      }

      setInputFromAmount(input);
    }
  };

  // const onChangeToInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
  //   let inputNum = Number(inputElement.target.value);

  //   if (payloadData.pools && payloadData.pool_config) {
  //     let methodCall;

  //     if (selectedAsset.to === SWAP_ASSET.LBTC) {
  //       console.log('lbtc');
  //       inputNum = inputNum * payloadData.preferred_unit.value;
  //       methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
  //     } else {
  //       console.log('usdt');
  //       inputNum = inputNum * PREFERRED_UNIT_VALUE.LBTC;
  //       methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
  //     }

  //     console.log(inputNum);
  //     const output = convertion.convertForCtx(
  //       inputNum,
  //       payloadData.slippage,
  //       payloadData.pools[0],
  //       payloadData.pool_config,
  //       methodCall,
  //     );

  //     console.log('2', output);

  //     if (selectedAsset.to === SWAP_ASSET.LBTC) {
  //       setInputFromAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toString());
  //       setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
  //     } else {
  //       setInputFromAmount((output.amount / payloadData.preferred_unit.value).toString());
  //       setAmountWithSlippage(output.amountWithSlipapge / payloadData.preferred_unit.value);
  //     }

  //     setInputToAmount(inputElement.target.value);
  //   }
  // };

  const calcAmountPercent = (newFromAmountPercent: FROM_AMOUNT_PERCENT | undefined) => {
    if (payloadData.pools && payloadData.pools.length > 0 && payloadData.pool_config && payloadData.wallet) {
      const currentPool = payloadData.pools[0];
      const poolConfig = payloadData.pool_config;

      let inputAmount = '';

      const quoteAssetId = currentPool.quote.asset;
      const quoteAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === quoteAssetId)?.amount;

      const tokenAssetId = currentPool.token.asset;
      const tokenAmountInWallet = payloadData.wallet.balances.find((bl) => bl.asset.assetHash === tokenAssetId)?.amount;

      if (selectedAsset.from === SWAP_ASSET.LBTC && quoteAmountInWallet) {
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
          inputAmount = (quoteAmountInWallet / payloadData.preferred_unit.value).toString();
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
          const quoteAmountInWalletHalf = quoteAmountInWallet / 2;
          inputAmount = (quoteAmountInWalletHalf / payloadData.preferred_unit.value).toString();
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
          inputAmount = (poolConfig.minRemainingSupply / payloadData.preferred_unit.value).toString();
        }
      } else if (selectedAsset.from === SWAP_ASSET.USDT && tokenAmountInWallet) {
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) {
          inputAmount = (tokenAmountInWallet / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
          const tokenAmountInWalletHalf = tokenAmountInWallet / 2;
          inputAmount = (tokenAmountInWalletHalf / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) {
          inputAmount = (poolConfig.minTokenValue / PREFERRED_UNIT_VALUE.LBTC).toFixed(2);
        }
      }

      onChangeFromInput(inputAmount);
    }
    setSelectedFromAmountPercent(newFromAmountPercent);
  };

  const assetOnChange = (asset: SWAP_ASSET, isFrom = true) => {
    if (isFrom) {
      if (asset === SWAP_ASSET.LBTC) {
        setSelectedAsset({
          from: asset,
          to: SWAP_ASSET.USDT,
        });
      } else {
        setSelectedAsset({
          from: asset,
          to: SWAP_ASSET.LBTC,
        });
      }
    } else {
      if (asset === SWAP_ASSET.LBTC) {
        setSelectedAsset({
          from: SWAP_ASSET.USDT,
          to: asset,
        });
      } else {
        setSelectedAsset({
          from: SWAP_ASSET.LBTC,
          to: asset,
        });
      }
    }

    setInputFromAmount('0.0');
    setInputToAmount('0');
    setSelectedFromAmountPercent(undefined);
  };

  const swapRouteChange = () => {
    if (selectedAsset.from === SWAP_ASSET.LBTC) {
      setSelectedAsset({
        from: SWAP_ASSET.USDT,
        to: SWAP_ASSET.LBTC,
      });
    } else {
      setSelectedAsset({
        from: SWAP_ASSET.LBTC,
        to: SWAP_ASSET.USDT,
      });
    }

    setInputFromAmount('0.0');
    setInputToAmount('0');
    setSelectedFromAmountPercent(undefined);
  };

  const swapClick = async () => {
    if (payloadData.wallet?.marina) {
      let methodCall;
      let numberFromAmount = 0;
      let numberToAmount = 0;

      if (selectedAsset.from === SWAP_ASSET.LBTC) {
        methodCall = CALL_METHOD.SWAP_QUOTE_FOR_TOKEN;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(payloadData.preferred_unit.value).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      } else {
        methodCall = CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;
        numberFromAmount = new Decimal(Number(inputFromAmount)).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
        numberToAmount = new Decimal(amountWithSlippage).mul(payloadData.preferred_unit.value).toNumber();
      }

      if (payloadData.pools && payloadData.pool_config) {
        const fundingTxInputs = fundingTx(numberFromAmount, payloadData.pools[0], payloadData.pool_config, methodCall);

        const rawTxHex = await payloadData.wallet.marina.sendTransaction([
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

        // notify('Funding Tx Id : ', fundingTxId);

        if (fundingTxId && fundingTxId !== '') {
          setInputFromAmount('0.0');
          setInputToAmount('0');

          const fundingTxDecode = await api.decodeRawTransaction(rawTxHex || '');

          const publicKey = fundingTxDecode.vin[0].txinwitness[1];

          let commitment;

          if (selectedAsset.from === SWAP_ASSET.LBTC) {
            commitment = commitmentTx.quoteToTokenCreateCommitmentTx(
              numberFromAmount,
              fundingTxId,
              publicKey,
              numberToAmount,
              payloadData.pool_config,
              payloadData.pools[0],
            );
          } else {
            commitment = commitmentTx.tokenToQuoteCreateCommitmentTx(
              numberFromAmount,
              fundingTxId,
              publicKey,
              numberToAmount,
              payloadData.pool_config,
              payloadData.pools[0],
            );
          }

          const commitmentTxId = await api.sendRawTransaction(commitment);

          if (commitmentTxId && commitmentTxId !== '') {
            const tempTxData: CommitmentStore = {
              txId: commitmentTxId,
              quoteAmount: numberFromAmount,
              quoteAsset: selectedAsset.from,
              tokenAmount: numberToAmount,
              tokenAsset: selectedAsset.to,
              timestamp: new Date().valueOf(),
              success: false,
              completed: false,
              seen: false,
              method: methodCall,
            };

            const storeOldData = getLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setLocalData(newStoreData);
          } /* else {
            notify('Bitmatrix Error : ', 'Commitment transaction could not be created.');
          } */

          // notify('Commitment Tx Id : ', commitmentTxId);
        } else {
          notify('Wallet Error : ', 'Funding transaction could not be created.');
        }
      } else {
        notify('Error : ', 'Pool Error');
      }
    } else {
      notify('Error : ', 'Wallet Error');
    }
  };

  const notify = (title: string, description: string) => {
    Notification.open({
      title: title,
      description: <div className="notificationTx">{description}</div>,
      duration: 20000,
    });
  };

  const infoMessage = (): string => {
    if (payloadData.pool_config && payloadData.pools && payloadData.pools.length > 0) {
      const config = payloadData.pool_config;
      const currentPool = payloadData.pools[0];
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
    return '';
  };

  return (
    <div className="swap-page-main">
      {/* Wallet list modal */}

      <Content className="swap-page-main-content">
        <div className="swap-page-layout">
          <div className="swap-page-content">
            <div className="from-content pt8">
              <SwapFromTab
                selectedFromAmountPercent={selectedFromAmountPercent}
                setselectedFromAmountPercent={calcAmountPercent}
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="from-amount-div">
                  <div className="from-text">From</div>
                  <input
                    className="from-input"
                    inputMode="decimal"
                    autoComplete="off"
                    autoCorrect="off"
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    spellCheck="false"
                    value={inputFromAmount}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeFromInput(event.target.value)}
                  />
                </div>
                <SwapAssetList selectedAsset={selectedAsset.from} setSelectedAsset={assetOnChange} />
              </div>
            </div>
            <div className="swap-arrow-icon" onClick={swapRouteChange}>
              <svg
                width="1.05rem"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="arrow-down"
                role="img"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"
                ></path>
              </svg>
            </div>
            <div className="from-content">
              <div className="from-amount-div">
                <div className="from-text">To</div>
                <input
                  className="from-input"
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  spellCheck="false"
                  value={inputToAmount}
                  // onChange={onChangeToInput}
                />
              </div>
              <SwapAssetList
                selectedAsset={selectedAsset.to}
                setSelectedAsset={(asset: SWAP_ASSET) => assetOnChange(asset, false)}
              />
            </div>
            <WalletButton text="Swap" onClick={() => swapClick()} disabled={Number(inputToAmount) <= 0} />
          </div>
        </div>
        <Info content={infoMessage()} />
      </Content>
    </div>
  );
};
