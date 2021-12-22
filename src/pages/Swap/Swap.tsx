import React, { useCallback, useEffect, useState } from 'react';
import { Button, Content } from 'rsuite';
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
import { commitmentTx, fundingTx } from '@bitmatrix/lib';
import './Swap.scss';
import axios from 'axios';
import { BmConfig } from '@bitmatrix/models';

const poolConfigs: BmConfig = {
  id: '43a2f4ef8ce286e57ab3e39e6da3741382ba542854a1b28231a7a5b8ba337fcd',
  minRemainingSupply: 1000,
  minTokenValue: 50000000,
  baseFee: {
    number: 1200,
    hex: '',
  },
  serviceFee: {
    number: 650,
    hex: '',
  },
  commitmentTxFee: {
    number: 100,
    hex: '0000000000000064',
  },
  defaultOrderingFee: {
    number: 1,
    hex: '01000000',
  },
  fundingOutputAddress:
    'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
  innerPublicKey:
    '1dae61a4a8f841952be3a511502d4f56e889ffa0685aa0098773ea2d4309f624',
};

export const Swap = (): JSX.Element => {
  // <SwapMainTab />
  // <SwapFromTab />
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] =
    useState<FROM_AMOUNT_PERCENT>();
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

  const { payloadData } = useContext(SettingsContext);

  document.title = ROUTE_PATH_TITLE.SWAP;

  useEffect(() => {
    const marinaWallet = new Wallet(WALLET_NAME.MARINA);
    setWallet(marinaWallet);

    marinaWallet.isEnabled().then((enabled) => {
      setWalletIsEnabled(enabled);
    });
  }, [walletIsEnabled]);

  const assetAmountToFromAmount = useCallback(
    (
      newAssetAmountList: AssetAmount[],
      newFromAmountPercent?: FROM_AMOUNT_PERCENT,
    ) => {
      let newFromAmount = 0;
      if (selectedAsset.from === SWAP_ASSET.LBTC)
        newFromAmount =
          newAssetAmountList.find(
            (assetAmount) => assetAmount.assetId === ASSET_ID.LBTC,
          )?.amount || 0;
      else if (selectedAsset.from === SWAP_ASSET.USDT)
        newFromAmount =
          newAssetAmountList.find(
            (assetAmount) => assetAmount.assetId === ASSET_ID.USDT,
          )?.amount || 0;

      if (newFromAmount >= 2500) {
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN)
          newFromAmount = 2500;
        else if (newFromAmountPercent === FROM_AMOUNT_PERCENT.HALF) {
          if (newFromAmount >= 5000) {
            newFromAmount *= 0.5;
          } else {
            newFromAmount = 0;
          }
        }
        // else if (newFromAmountPercent === FROM_AMOUNT_PERCENT.ALL) newFromAmount *= 1;
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

  const onChangeFromInput = (
    inputElement: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputNum = Number(inputElement.target.value);

    const output =
      selectedAsset.from === SWAP_ASSET.LBTC
        ? fundingTx.lbtcToTokenAmount(inputNum, payloadData.slippage, '1000')
        : fundingTx.tokenToLbtcAmount(
            inputNum,
            payloadData.slippage,
            '50000000',
          );

    setInputFromAmount(inputElement.target.value);
    setInputToAmount(output.toString());
  };

  const onChangeToInput = (
    inputElement: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputNum = Number(inputElement.target.value);

    const output =
      selectedAsset.to === SWAP_ASSET.LBTC
        ? fundingTx.lbtcToTokenAmount(inputNum, payloadData.slippage, '1000')
        : fundingTx.tokenToLbtcAmount(
            inputNum,
            payloadData.slippage,
            '50000000',
          );

    setInputFromAmount(output.toString());
    setInputToAmount(inputElement.target.value);
  };

  const swapClick = async () => {
    let input;

    if (selectedAsset.from === SWAP_ASSET.LBTC) {
      input = fundingTx.lbtcToToken(
        Number(inputFromAmount),
        'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
        '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
        1200,
        650,
        100,
        1,
      );
    } else {
      input = fundingTx.tokenToLBtc(
        Number(inputFromAmount),
        'tex1qft5p2uhsdcdc3l2ua4ap5qqfg4pjaqlp250x7us7a8qqhrxrxfsqh7creg',
        '144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49',
        '213cbc4df83abc230852526b1156877f60324da869f0affaee73b6a6a32ad025',
        1200,
        650,
        100,
        1,
      );
    }

    const rawTxHex = await wallet?.sendTransaction([
      {
        address: input.fundingOutput1Address,
        value: input.fundingOutput1Value,
        asset: input.fundingOutput1AssetId,
      },
      {
        address: input.fundingOutput2Address,
        value: input.fundingOutput2Value,
        asset: input.fundingOutput2AssetId,
      },
    ]);

    const transactionId = await axios
      .post(
        'http://157.230.101.158:9485/rpc',
        JSON.stringify({
          jsonrpc: '1.0',
          id: 'curltest',
          method: 'sendrawtransaction',
          params: [rawTxHex],
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        return response.data.result;
      });

    if (transactionId) {
      axios
        .post(
          'http://157.230.101.158:9485/rpc',
          JSON.stringify({
            jsonrpc: '1.0',
            id: 'curltest',
            method: 'decoderawtransaction',
            params: [rawTxHex],
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((response) => {
          console.log(transactionId);
          const publicKey = response.data.result.vin[0].txinwitness[1];
          let commitment;
          if (selectedAsset.from === SWAP_ASSET.LBTC) {
            commitment = commitmentTx.lbtcToTokenCreateCommitmentTx(
              Number(inputFromAmount),
              transactionId,
              publicKey,
              Number(inputToAmount),
              poolConfigs.defaultOrderingFee,
              poolConfigs.baseFee,
              poolConfigs.commitmentTxFee,
              poolConfigs.innerPublicKey,
            );
          } else {
            commitment = commitmentTx.tokenToLbtcCreateCommitmentTx(
              Number(inputFromAmount),
              transactionId,
              publicKey,
              Number(inputToAmount),
              poolConfigs.defaultOrderingFee,
              poolConfigs.baseFee,
              poolConfigs.serviceFee,
              poolConfigs.commitmentTxFee,
              poolConfigs.innerPublicKey,
            );
          }

          console.log(commitment);
        });
    }
  };

  const setUtxosAll = (newUtxos: UnblindedOutput[]) => {
    setUtxos(newUtxos);

    const newAssetAmountList: AssetAmount[] = [];
    newAssetAmountList.push({
      assetId: ASSET_ID.LBTC,
      assetName: SWAP_ASSET.LBTC,
      amount: newUtxos
        .filter(
          (ut) => ut.unblindData.asset === Buffer.from(ASSET_ID.LBTC, 'hex'),
        )
        .reduce((p, u) => {
          return p + Number(u.unblindData.value);
        }, 0),
    });
    newAssetAmountList.push({
      assetId: ASSET_ID.USDT,
      assetName: SWAP_ASSET.USDT,
      amount: newUtxos
        .filter(
          (ut) => ut.unblindData.asset === Buffer.from(ASSET_ID.USDT, 'hex'),
        )
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
        walletOnClick={(walletName: WALLET_NAME) =>
          setWallet(new Wallet(walletName))
        }
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
              {/* Coming soon */}
            </Button>
          </div>
        </div>
        <Info content=" Network fee 0.1sat/byte $0.12" />
      </Content>

      {/* <div>
        {assetAmounts.map((assetAmount) => (
          <>
            <span>
              {assetAmount.assetName}: {assetAmount.amount}
            </span>
            <br />
          </>
        ))}
      </div> */}
    </div>
  );
};
