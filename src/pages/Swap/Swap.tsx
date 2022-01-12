/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from 'react';
import { Notification, Button, Content } from 'rsuite';
import { ASSET_ID } from '../../lib/liquid-dev/ASSET_ID';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { PREFERRED_UNIT_VALUE } from '../../enum/PREFERRED_UNIT_VALUE';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { SwapAssetList } from '../../components/SwapAssetList/SwapAssetList';
import { AssetAmount } from '../../model/AssetAmount';
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

  const [assetAmounts, setAssetAmounts] = useState<AssetAmount[]>([]);

  const [inputFromAmount, setInputFromAmount] = useState<string>('0');

  const [inputToAmount, setInputToAmount] = useState<string>('0');

  const [amountWithSlippage, setAmountWithSlippage] = useState<number>(0);

  const { setTxLocalData, getTxLocalData } = useLocalStorage<CommitmentStore[]>('BmTxV3');

  const { payloadData } = useContext(SettingsContext);

  document.title = ROUTE_PATH_TITLE.SWAP;

  const assetAmountToFromAmount = useCallback(
    (newAssetAmountList: AssetAmount[], newFromAmountPercent?: FROM_AMOUNT_PERCENT) => {
      let newFromAmount = 0;
      if (selectedAsset.from === SWAP_ASSET.LBTC)
        newFromAmount = newAssetAmountList.find((assetAmount) => assetAmount.assetId === ASSET_ID.LBTC)?.amount || 0;
      else if (selectedAsset.from === SWAP_ASSET.USDT)
        newFromAmount = newAssetAmountList.find((assetAmount) => assetAmount.assetId === ASSET_ID.USDT)?.amount || 0;

      if (newFromAmount >= 2500) {
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) newFromAmount = 2500;
        else if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
          if (newFromAmount >= 5000) {
            newFromAmount *= 0.5;
          } else {
            newFromAmount = 0;
          }
        }
      }
      if (newFromAmount === 0) {
        setInputFromAmount('0.0');
      } else {
        setInputFromAmount((newFromAmount / PREFERRED_UNIT_VALUE.LBTC).toFixed(8).toString());
      }
    },
    [selectedAsset],
  );

  useEffect(() => {
    assetAmountToFromAmount(assetAmounts, selectedFromAmountPercent);
  }, [assetAmountToFromAmount, assetAmounts, selectedFromAmountPercent]);

  const onChangeFromInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
    let inputNum = Number(inputElement.target.value);

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

      if (selectedAsset.from === SWAP_ASSET.LBTC) {
        setInputToAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toString());
        setAmountWithSlippage(output.amountWithSlipapge / PREFERRED_UNIT_VALUE.LBTC);
      } else {
        setInputToAmount((output.amount / payloadData.preferred_unit.value).toString());
        setAmountWithSlippage(output.amountWithSlipapge / payloadData.preferred_unit.value);
      }

      setInputFromAmount(inputElement.target.value);
    }
  };

  // const onChangeToInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputNum = Number(inputElement.target.value);

  //   const methodCall =
  //     selectedAsset.to === SWAP_ASSET.LBTC ? CALL_METHOD.SWAP_QUOTE_FOR_TOKEN : CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;

  //   if (payloadData.pools && poolConfigs) {
  //     const output = convertion.convertForCtx(
  //       inputNum * payloadData.preferred_unit.value,
  //       payloadData.slippage,
  //       payloadData.pools[0],
  //       poolConfigs,
  //       methodCall,
  //     );

  //     setInputFromAmount((output / payloadData.preferred_unit.value).toString());
  //     setInputToAmount(inputElement.target.value);
  //   }
  // };

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

            const storeOldData = getTxLocalData() || [];

            const newStoreData = [...storeOldData, tempTxData];

            setTxLocalData(newStoreData);
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

  return (
    <div className="swap-page-main">
      {/* Wallet list modal */}

      <Content className="swap-page-main-content">
        <div className="swap-page-layout">
          <div className="swap-page-content">
            <div className="from-content pt8">
              <SwapFromTab
                selectedFromAmountPercent={selectedFromAmountPercent}
                setselectedFromAmountPercent={setSelectedFromAmountPercent}
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
                    onChange={onChangeFromInput}
                  />
                </div>
                <SwapAssetList
                  selectedAsset={selectedAsset.from}
                  setSelectedAsset={(asset: SWAP_ASSET) => {
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
                  }}
                />
              </div>
            </div>
            <div
              className="swap-arrow-icon"
              onClick={() => {
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
              }}
            >
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
                  disabled
                />
              </div>
              <SwapAssetList
                selectedAsset={selectedAsset.to}
                setSelectedAsset={(asset: SWAP_ASSET) => {
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
                }}
              />
            </div>
            <WalletButton text="Swap" onClick={() => swapClick()} disabled={Number(inputToAmount) <= 0}></WalletButton>
          </div>
        </div>
        <Info content="Network fee 1951 sats ($0.91)" />
      </Content>
    </div>
  );
};
