import React, { useContext, useEffect, useState } from 'react';
import FROM_AMOUNT_PERCENT from '../../../enum/FROM_AMOUNT_PERCENT';
import { SwapFromTab } from '../../../components/SwapFromTab/SwapFromTab';
import LiquidityFooter from '../LiquidityFooter/LiquidityFooter';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import plus from '../../../images/plus.png';
import btc from '../../../images/liquid_btc.png';
import usdt from '../../../images/usdt.png';
import { CALL_METHOD, BmConfig } from '@bitmatrix/models';
import SettingsContext from '../../../context/SettingsContext';
import { api, convertion, fundingTxForLiquidity } from '@bitmatrix/lib';
import { IWallet } from '../../../lib/wallet/IWallet';
import Decimal from 'decimal.js';
import './AddLiquidity.scss';
import { Button } from 'rsuite';
import { detectProvider } from 'marina-provider';
import { Wallet } from '../../../lib/wallet';

const AddLiquidity = (): JSX.Element => {
  const [lbctPercent, setLbtcPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [usdtPercent, setUsdtPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [tokenAmount, setTokenAmount] = useState<string>('0');
  const [quoteAmount, setQuoteAmount] = useState<string>('0');
  const [poolConfigs, setPoolConfigs] = useState<BmConfig>();
  const [wallet, setWallet] = useState<IWallet>();
  const [walletIsEnabled, setWalletIsEnabled] = useState<boolean>(false);

  const { payloadData } = useContext(SettingsContext);

  useEffect(() => {
    detectProvider('marina')
      .then((marina) => {
        const marinaWallet = new Wallet();
        setWallet(marinaWallet);

        marina.isEnabled().then((enabled) => {
          setWalletIsEnabled(enabled);
        });
      })
      .catch(() => {
        const marinaWallet = new Wallet();
        setWallet(marinaWallet);
      });
  }, [walletIsEnabled]);

  // fetch pool config
  useEffect(() => {
    if (payloadData.pools) {
      api.getBmConfigs(payloadData.pools[0].id).then((response: BmConfig) => {
        setPoolConfigs(response);
      });
    }
  }, [payloadData.pools]);

  // const calcRecipientValueB = () => {
  //   const user_provided_remaining_lbtc_supply = Number(quoteAmount);
  //   const user_provided_remaining_lbtc_supply_16 = Math.floor(user_provided_remaining_lbtc_supply / 16);
  //   if (pool) {
  //     const pool_lp_supply = Number(pool.lp.value);
  //     const pool_lp_circulation = 2000000000 - pool_lp_supply;
  //     const mul_circ = user_provided_remaining_lbtc_supply_16 * pool_lp_circulation;
  //     const pool_lbtc_supply = Number(pool.quote.value);
  //     const pool_lbtc_supply_down = Math.floor(pool_lbtc_supply / 16);

  //     const user_lp_receiving_1 = Math.floor(mul_circ / pool_lbtc_supply_down);

  //     const user_provided_token_supply = Number(tokenAmount);

  //     const user_provided_token_supply_down = Math.floor(user_provided_token_supply / 2000000);
  //     const mul_circ2 = user_provided_token_supply_down * pool_lp_circulation;
  //     const pool_token_supply = Number(pool.token.value);
  //     const pool_token_supply_down = Math.floor(pool_token_supply / 2000000);

  //     const user_lp_receiving_2 = Math.floor(mul_circ2 / pool_token_supply_down);

  //     const user_lp_received = Math.min(user_lp_receiving_1, user_lp_receiving_2);

  //     return user_lp_received;
  //   }
  // };

  const onChangeQuoteAmount = (inputElement: React.ChangeEvent<HTMLInputElement>) => {
    const inputNum = Number(inputElement.target.value);

    const methodCall = CALL_METHOD.ADD_LIQUIDITY;

    if (payloadData.pools && poolConfigs) {
      const output = convertion.convertForCtx(
        inputNum * payloadData.preferred_unit.value,
        payloadData.slippage,
        payloadData.pools[0],
        poolConfigs,
        methodCall,
      );
      setQuoteAmount(inputElement.target.value);
      setTokenAmount((output.amount / payloadData.preferred_unit.value).toString());
    }
  };

  const addLiquidityClick = async () => {
    if (wallet) {
      const methodCall = CALL_METHOD.ADD_LIQUIDITY;

      const numberFromAmount = new Decimal(Number(quoteAmount)).mul(payloadData.preferred_unit.value).toNumber();
      const numberToAmount = new Decimal(tokenAmount).mul(payloadData.preferred_unit.value).toNumber();

      if (payloadData.pools && poolConfigs) {
        const fundingTxInputs = fundingTxForLiquidity(
          numberFromAmount,
          numberToAmount,
          payloadData.pools[0],
          poolConfigs,
          methodCall,
        );

        const rawTxHex = await wallet.sendTransaction([
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
        console.log('rawTxHex', rawTxHex);

        await api.sendRawTransaction(rawTxHex || '');
      }
    }
  };

  return (
    <>
      <div className="add-liquidity-main">
        <div className="add-liquidity-item pt8">
          <SwapFromTab selectedFromAmountPercent={lbctPercent} setselectedFromAmountPercent={setLbtcPercent} />
          <div className="add-liquidity-item-content">
            <div className="add-liquidity-input-div">
              <div className="add-liquidity-input-content">
                <div className="add-liquidity-text">{SWAP_ASSET.LBTC} Liquidity</div>
                <img className="liquidity-btc-icon" src={btc} alt="" />
              </div>
              <input
                className="add-liquidity-input"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                spellCheck="false"
                value={quoteAmount}
                onChange={onChangeQuoteAmount}
              />
            </div>
          </div>
        </div>
        <div className="add-liquidity-plus-icon">
          <img className="add-liquidity-page-icons" src={plus} alt="" />
        </div>
        <div className="add-liquidity-item pt8">
          <SwapFromTab selectedFromAmountPercent={usdtPercent} setselectedFromAmountPercent={setUsdtPercent} />
          <div className="add-liquidity-item-content">
            <div className="add-liquidity-input-div">
              <div className="add-liquidity-input-content">
                <div className="add-liquidity-text">{SWAP_ASSET.USDT} Liquidity</div>
                <img className="liquidity-usdt-icon" src={usdt} alt="" />
              </div>
              <input
                className="add-liquidity-input"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                pattern="^[0-9]*[.,]?[0-9]*$"
                spellCheck="false"
                value={tokenAmount}
                // onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTokenAmount(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <LiquidityFooter received={0} rewards={0} pool_share={0} />
      <div className="liquidity-button-content">
        <Button appearance="default" className="liquidity-button" onClick={() => addLiquidityClick()}>
          Add Liquidity
        </Button>
      </div>
    </>
  );
};

export default AddLiquidity;
