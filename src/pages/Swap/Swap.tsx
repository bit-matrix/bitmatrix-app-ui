/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from "react";
import { Button, Content } from "rsuite";
import { Icon } from "rsuite";
import info from "../../images/info.png";
import bitmatrix_icon from "../../images/bitmatrix_icon.png";
import "./Swap.scss";
import WalletListModal from "../../components/WalletListModal/WalletListModal";
import { WALLET_NAME } from "../../lib/wallet/WALLET_NAME";
import { UtxoInterface } from "ldk";
import { MarinaAddressInterface } from "../../lib/wallet/marina/IMarina";
import { ASSET_ID } from "../../lib/liquid-dev/ASSET_ID";
import FROM_AMOUNT_PERCENT from "../../enum/FROM_AMOUNT_PERCENT";
import SwapFromTab from "../../components/SwapFromTab/SwapFromTab";
import SWAP_ASSET from "../../enum/SWAP_ASSET";
import SwapMainTab from "../../components/SwapMainTab/SwapMainTab";
import SWAP_MAIN_TAB from "../../enum/SWAP_MAIN_TAB";
import SwapAssetList from "../../components/SwapAssetList/SwapAssetList";
import IAssetAmount from "../../model/AssetAmount";

const Swap = () => {
  // <SwapMainTab />
  const [selectedMainTab, setSelectedMainTab] = useState<SWAP_MAIN_TAB>(SWAP_MAIN_TAB.SWAP);
  // <SwapFromTab />
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] = useState<FROM_AMOUNT_PERCENT>(FROM_AMOUNT_PERCENT.ALL);
  // <SwapAssetList />
  const [selectedAssetFrom, setSelectedAssetFrom] = useState<SWAP_ASSET>(SWAP_ASSET.LBTC);
  const [selectedAssetTo, setSelectedAssetTo] = useState<SWAP_ASSET>(SWAP_ASSET.LBTC);
  // <WalletListModal />
  const [showWalletList, setShowWalletList] = useState<boolean>(false);

  // Wallet Amounts
  const [assetAmounts, setAssetAmounts] = useState<IAssetAmount[]>([]);

  // const [fromAmount, setFromAmount] = useState<number>(0);
  // const [toAmount, setToAmount] = useState<number>(0);

  const [inputFromAmount, setInputFromAmount] = useState<string>("0.0");
  const [inputToAmount, setInputToAmount] = useState<string>("0.0");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newAddress, setNewAddress] = useState<MarinaAddressInterface>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [utxos, setUtxos] = useState<UtxoInterface[]>([]);

  const assetAmountToFromAmount = useCallback(
    (newAssetAmountList: IAssetAmount[], newFromAmountPercent: FROM_AMOUNT_PERCENT) => {
      let newFromAmount: number = 0;
      if (selectedAssetFrom === SWAP_ASSET.LBTC) newFromAmount = newAssetAmountList.find((assetAmount) => assetAmount.assetId === ASSET_ID.LBTC)?.amount || 0;
      else if (selectedAssetFrom === SWAP_ASSET.USDT) newFromAmount = newAssetAmountList.find((assetAmount) => assetAmount.assetId === ASSET_ID.USDT)?.amount || 0;

      if (newFromAmount >= 2500) {
        if (newFromAmountPercent === FROM_AMOUNT_PERCENT.MIN) newFromAmount = 2500;
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
        setInputFromAmount("0.0");
      } else {
        setInputFromAmount((newFromAmount / 100000000).toFixed(8).toString());
      }
    },
    [selectedAssetFrom]
  );

  useEffect(() => {
    assetAmountToFromAmount(assetAmounts, selectedFromAmountPercent);
  }, [assetAmountToFromAmount, assetAmounts, selectedFromAmountPercent]);

  const onChangeFromInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
    setInputFromAmount(inputElement.target.value);
    // let newFromAmount: number = 0;
    // const inputNumber = Number(inputElement.target.value);
    // if (!isNaN(inputNumber)) {
    //   newFromAmount = inputNumber;
    // }
    // setFromAmount(newFromAmount * 100000000);
  };

  const onChangeToInput = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
    setInputToAmount(inputElement.target.value);
    // let newToAmount: number = 0;
    // const inputNumber = Number(inputElement.target.value);
    // if (!isNaN(inputNumber)) {
    //   newToAmount = inputNumber;
    // }
    // setToAmount(newToAmount * 100000000);
  };

  const setUtxosAll = (newUtxos: UtxoInterface[]) => {
    setUtxos(newUtxos);

    const newAssetAmountList: IAssetAmount[] = [];
    newAssetAmountList.push({
      assetId: ASSET_ID.LBTC,
      assetName: SWAP_ASSET.LBTC,
      amount: newUtxos
        .filter((ut) => ut.asset === ASSET_ID.LBTC)
        .reduce((p, u) => {
          return p + (u.value || 0);
        }, 0),
    });
    newAssetAmountList.push({
      assetId: ASSET_ID.USDT,
      assetName: SWAP_ASSET.USDT,
      amount: newUtxos
        .filter((ut) => ut.asset === ASSET_ID.USDT)
        .reduce((p, u) => {
          return p + (u.value || 0);
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
        walletOnClick={(walletName: WALLET_NAME) => console.log(walletName)}
        close={() => setShowWalletList(false)}
        setNewAddress={setNewAddress}
        setUtxos={setUtxosAll}
      />

      <Content className="swap-page-main-content">
        <img className="bitmatrix-icon" src={bitmatrix_icon} alt="" />
        <div className="swap-page-layout">
          <SwapMainTab selectedMainTab={selectedMainTab} setSelectedMainTab={setSelectedMainTab} />
          <div className="swap-page-content">
            {selectedMainTab === SWAP_MAIN_TAB.SWAP ? (
              <>
                <div className="from-content pt-2">
                  <SwapFromTab selectedFromAmountPercent={selectedFromAmountPercent} setselectedFromAmountPercent={setSelectedFromAmountPercent} />
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
                  <div className="from-selection">
                    <SwapAssetList selectedAsset={selectedAssetFrom} setSelectedAsset={setSelectedAssetFrom} />
                  </div>
                </div>
                <div className="swap-arrow-icon">
                  <svg width="1.05rem" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-down" role="img" viewBox="0 0 448 512">
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
                  <div className="from-selection">
                    <SwapAssetList selectedAsset={selectedAssetTo} setSelectedAsset={setSelectedAssetTo} />
                  </div>
                </div>
                <Button
                  appearance="default"
                  className="swap-button"
                  onClick={() => {
                    if (assetAmounts.length > 0) {
                      console.log("TODO");
                    } else {
                      setShowWalletList(true);
                    }
                  }}
                >
                  {assetAmounts.length > 0 ? "Swap" : "Connect Wallet"}
                </Button>
              </>
            ) : (
              <div>Pool is not live yet.</div>
            )}
          </div>

          <div id="wrap" className="swap-footer-tab">
            <div id="one" className="swap-footer-tab-one">
              <img className="info-img" src={info} alt="" />
            </div>
            <div id="two" className="swap-footer-tab-two">
              Network fee 0.1sat/byte $0.12
            </div>
          </div>
        </div>
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
      <div className="swap-page-footer">
        <div className="swap-page-footer-icons">
          <a href="https://medium.com/bit-matrix" className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="medium" />
          </a>
          <a href="https://twitter.com/bitmatrix_" className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="twitter" />
          </a>
          <a href="https://t.me/bitmatrix_community" className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="telegram" />
          </a>
          <a href="https://github.com/bit-matrix" className="swap-page-footer-icon-item">
            <Icon className="swap-page-footer-icon" icon="github" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Swap;
