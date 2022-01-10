import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import FROM_AMOUNT_PERCENT from '../../../enum/FROM_AMOUNT_PERCENT';
import { SwapFromTab } from '../../../components/SwapFromTab/SwapFromTab';
import LiquidityFooter from '../LiquidityFooter/LiquidityFooter';
import SWAP_ASSET from '../../../enum/SWAP_ASSET';
import plus from '../../../images/plus.png';
import btc from '../../../images/liquid_btc.png';
import usdt from '../../../images/usdt.png';
import { CALL_METHOD, BmConfig } from '@bitmatrix/models';
import SettingsContext from '../../../context/SettingsContext';
import { api, commitmentTx, convertion, fundingTxForLiquidity } from '@bitmatrix/lib';
import { IWallet } from '../../../lib/wallet/IWallet';
import Decimal from 'decimal.js';
import { Button, Content, Icon, Notification } from 'rsuite';
import { detectProvider } from 'marina-provider';
import { Wallet } from '../../../lib/wallet';
import { PREFERRED_UNIT_VALUE } from '../../../enum/PREFERRED_UNIT_VALUE';
import './AddLiquidity.scss';

const AddLiquidity = (): JSX.Element => {
  const [lbctPercent, setLbtcPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [usdtPercent, setUsdtPercent] = useState<FROM_AMOUNT_PERCENT>();
  const [tokenAmount, setTokenAmount] = useState<string>('0');
  const [quoteAmount, setQuoteAmount] = useState<string>('0');
  const [poolConfigs, setPoolConfigs] = useState<BmConfig>();
  const [wallet, setWallet] = useState<IWallet>();
  const [walletIsEnabled, setWalletIsEnabled] = useState<boolean>(false);

  const { payloadData } = useContext(SettingsContext);

  const history = useHistory();

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
      setTokenAmount((output.amount / PREFERRED_UNIT_VALUE.LBTC).toString());
    }
  };

  const notify = (title: string, description: string) => {
    Notification.open({
      title: title,
      description: <div className="notificationTx">{description}</div>,
      duration: 20000,
    });
  };

  const addLiquidityClick = async () => {
    if (wallet) {
      const methodCall = CALL_METHOD.ADD_LIQUIDITY;

      const numberFromAmount = new Decimal(Number(quoteAmount)).mul(payloadData.preferred_unit.value).toNumber();
      const numberToAmount = new Decimal(tokenAmount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();

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

        const fundingTxId = await api.sendRawTransaction(rawTxHex || '');

        console.log('fundingTxId', fundingTxId);

        if (fundingTxId && fundingTxId !== '') {
          setQuoteAmount('0');
          setTokenAmount('0');

          const fundingTxDecode = await api.decodeRawTransaction(rawTxHex || '');

          const publicKey = fundingTxDecode.vin[0].txinwitness[1];

          const commitment = commitmentTx.liquidityAddCreateCommitmentTx(
            numberFromAmount,
            numberToAmount,
            fundingTxId,
            publicKey,
            poolConfigs,
            payloadData.pools[0],
          );

          console.log('commitment raw hex :', commitment);

          const commitmentTxId = await api.sendRawTransaction(commitment);

          notify('Commitment Tx Id : ', commitmentTxId);
        } else {
          notify('Wallet Error : ', 'Funding transaction could not be created.');
        }
      }
    }
  };

  const calcLpValues = () => {
    const currentPool = payloadData.pools;
    if (currentPool && currentPool.length > 0) {
      const quoteAmountN = new Decimal(Number(quoteAmount)).mul(payloadData.preferred_unit.value).toNumber();
      const tokenAmountN = new Decimal(tokenAmount).mul(PREFERRED_UNIT_VALUE.LBTC).toNumber();
      const recipientValue = convertion.calcRecipientValue(currentPool[0], quoteAmountN, tokenAmountN);
      return {
        lpReceived: (Number(recipientValue.lpReceived) / PREFERRED_UNIT_VALUE.LBTC).toFixed(8),
        poolRate: (Number(recipientValue.poolRate) * 100).toFixed(2),
      };
    }
    return { lpReceived: '0', poolRate: '0' };
  };

  return (
    <div className="liquidity-page-main">
      <Content className="liquidity-page-content">
        <Button className="liquidity-page-back-button" onClick={() => history.goBack()}>
          <Icon className="liquidity-back-icon" icon="angle-left" size="4x" />
          <div className="liquidity-back-text">L-BTC/USDT</div>
        </Button>
        <div>
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
                    onChange={
                      (/*event: React.ChangeEvent<HTMLInputElement>*/) => {
                        // setTokenAmount(event.target.value);
                      }
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <LiquidityFooter received={calcLpValues().lpReceived} rewards={'0.2'} pool_share={calcLpValues().poolRate} />
          <div className="liquidity-button-content">
            <Button appearance="default" className="liquidity-button" onClick={() => addLiquidityClick()}>
              Add Liquidity
            </Button>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default AddLiquidity;
