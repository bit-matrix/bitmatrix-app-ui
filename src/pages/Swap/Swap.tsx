/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback, useEffect, useState } from 'react';
import { Notification, Button, Content } from 'rsuite';
import { WalletListModal } from '../../components/WalletListModal/WalletListModal';
import { WALLET_NAME } from '../../lib/wallet/WALLET_NAME';
import { UnblindedOutput } from 'ldk';
import { MarinaAddressInterface } from '../../lib/wallet/marina/IMarina';
import { ASSET_ID } from '../../lib/liquid-dev/ASSET_ID';
import FROM_AMOUNT_PERCENT from '../../enum/FROM_AMOUNT_PERCENT';
import { SwapFromTab } from '../../components/SwapFromTab/SwapFromTab';
import SWAP_ASSET from '../../enum/SWAP_ASSET';
import { SwapAssetList } from '../../components/SwapAssetList/SwapAssetList';
import { AssetAmount } from '../../model/AssetAmount';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Info } from '../../components/common/Info/Info';
import { IWallet } from '../../lib/wallet/IWallet';
import { Wallet } from '../../lib/wallet';
import { useContext } from 'react';
import SettingsContext from '../../context/SettingsContext';
import { commitmentTx, fundingTx, api, convertion } from '@bitmatrix/lib';
import './Swap.scss';
import { BmConfig, Pool, CALL_METHOD } from '@bitmatrix/models';
import { detectProvider } from 'marina-provider';

export const Swap = (): JSX.Element => {
  // <SwapMainTab />
  // <SwapFromTab />
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>();
  // <SwapAssetList />
  const [selectedAsset, setSelectedAsset] = useState<{
    from: SWAP_ASSET;
    to: SWAP_ASSET;
  }>({ from: SWAP_ASSET.LBTC, to: SWAP_ASSET.USDT });

  // <WalletListModal />
  const [showWalletList, setShowWalletList] = useState<boolean>(false);

  // Wallet Amounts
  const [assetAmounts, setAssetAmounts] = useState<AssetAmount[]>([]);

  // const [fromAmount, setFromAmount] = useState<number>(0);
  // const [toAmount, setToAmount] = useState<number>(0);

  const [inputFromAmount, setInputFromAmount] = useState<string>('0');
  const [inputToAmount, setInputToAmount] = useState<string>('0');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newAddress, setNewAddress] = useState<MarinaAddressInterface>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [utxos, setUtxos] = useState<UnblindedOutput[]>([]);

  const [wallet, setWallet] = useState<IWallet>();

  const [walletIsEnabled, setWalletIsEnabled] = useState<boolean>(false);

  const [poolConfigs, setPoolConfigs] = useState<BmConfig>();
  const [pool, setPool] = useState<Pool>();

  const { payloadData } = useContext(SettingsContext);

  document.title = ROUTE_PATH_TITLE.SWAP;

  useEffect(() => {
    detectProvider('marina')
      .then((marina) => {
        const marinaWallet = new Wallet(WALLET_NAME.MARINA);
        setWallet(marinaWallet);

        marina.isEnabled().then((enabled) => {
          setWalletIsEnabled(enabled);
        });
      })
      .catch(() => {
        const marinaWallet = new Wallet(WALLET_NAME.MARINA);
        setWallet(marinaWallet);
      });
  }, [walletIsEnabled]);

  useEffect(() => {
    api.getPools().then((pools: Pool[]) => {
      const tempPool = pools[0];
      setPool(tempPool);

      api.getBmConfigs(tempPool.id).then((response: BmConfig) => {
        setPoolConfigs(response);
      });
    });
  }, []);

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
        setInputFromAmount((newFromAmount / 100000000).toFixed(8).toString());
      }
    },
    [selectedAsset],
  );

  useEffect(() => {
    assetAmountToFromAmount(assetAmounts, selectedFromAmountPercent);
  }, [assetAmountToFromAmount, assetAmounts, selectedFromAmountPercent]);

  const onChangeFromInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
    const inputNum = Number(inputElement.target.value);

    const methodCall =
      selectedAsset.from === SWAP_ASSET.LBTC ? CALL_METHOD.SWAP_QUOTE_FOR_TOKEN : CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;

    const output = convertion.convertForCtx(inputNum, payloadData.slippage, pool!, poolConfigs!, methodCall);

    setInputFromAmount(inputElement.target.value);
    setInputToAmount(output.toString());
  };

  const onChangeToInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
    const inputNum = Number(inputElement.target.value);

    const methodCall =
      selectedAsset.to === SWAP_ASSET.LBTC ? CALL_METHOD.SWAP_QUOTE_FOR_TOKEN : CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;

    const output = convertion.convertForCtx(inputNum, payloadData.slippage, pool!, poolConfigs!, methodCall);

    setInputFromAmount(output.toString());
    setInputToAmount(inputElement.target.value);
  };

  const swapClick = async () => {
    const methodCall =
      selectedAsset.from === SWAP_ASSET.LBTC ? CALL_METHOD.SWAP_QUOTE_FOR_TOKEN : CALL_METHOD.SWAP_TOKEN_FOR_QUOTE;

    const fundingTxInputs = fundingTx(Number(inputFromAmount), pool!, poolConfigs!, methodCall);

    wallet
      ?.sendTransaction([
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
      ])
      .then((rawTxHex) => {
        api.sendRawTransaction(rawTxHex).then((response) => {
          const txId = response;

          Notification.open({
            title: 'Funding Tx Id : ',
            description: <div className="notificationTx">{txId}</div>,
            duration: 20000,
          });

          api.decodeRawTransaction(rawTxHex).then((response) => {
            const publicKey = response.vin[0].txinwitness[1];

            let commitment;

            if (selectedAsset.from === SWAP_ASSET.LBTC) {
              commitment = commitmentTx.quoteToTokenCreateCommitmentTx(
                Number(inputFromAmount),
                txId,
                publicKey,
                Number(inputToAmount),
                poolConfigs!,
                pool!,
              );
            } else {
              commitment = commitmentTx.tokenToQuoteCreateCommitmentTx(
                Number(inputFromAmount),
                txId,
                publicKey,
                Number(inputToAmount),
                poolConfigs!,
                pool!,
              );
            }

            console.log(commitment);

            api.sendRawTransaction(commitment).then((response) => {
              Notification.open({
                title: 'Commitment Tx Id : ',
                description: <div className="notificationTx">{response}</div>,
                duration: 20000,
              });
            });
          });
        });
      });
  };

  const setUtxosAll = (newUtxos: UnblindedOutput[]) => {
    setUtxos(newUtxos);

    const newAssetAmountList: AssetAmount[] = [];
    newAssetAmountList.push({
      assetId: ASSET_ID.LBTC,
      assetName: SWAP_ASSET.LBTC,
      amount: newUtxos
        .filter((ut) => ut.unblindData.asset === Buffer.from(ASSET_ID.LBTC, 'hex'))
        .reduce((p, u) => {
          return p + Number(u.unblindData.value);
        }, 0),
    });
    newAssetAmountList.push({
      assetId: ASSET_ID.USDT,
      assetName: SWAP_ASSET.USDT,
      amount: newUtxos
        .filter((ut) => ut.unblindData.asset === Buffer.from(ASSET_ID.USDT, 'hex'))
        .reduce((p, u) => {
          return p + Number(u.unblindData.value);
        }, 0),
    });
    setAssetAmounts(newAssetAmountList);

    assetAmountToFromAmount(newAssetAmountList, selectedFromAmountPercent);
  };

  return (
    <div className="swap-page-main">
      {/* Wallet list modal */}
      <WalletListModal
        show={showWalletList}
        wallet={wallet}
        walletOnClick={(walletName: WALLET_NAME) => setWallet(new Wallet(walletName))}
        close={() => setShowWalletList(false)}
        setNewAddress={setNewAddress}
        setUtxos={setUtxosAll}
      />

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
            <div className="swap-arrow-icon">
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
                  onChange={onChangeToInput}
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
            <Button
              appearance="default"
              className="swap-button"
              onClick={() => {
                if (walletIsEnabled) {
                  swapClick();
                } else {
                  setShowWalletList(true);
                }
              }}
            >
              {walletIsEnabled ? 'Swap' : 'Connect Wallet'}
            </Button>
          </div>
        </div>
        <Info content=" Network fee 0.1sat/byte $0.12" />
      </Content>
    </div>
  );
};
