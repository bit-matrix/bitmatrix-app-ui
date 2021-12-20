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
import {
  lbtcToTokenSwap,
  lbtcToTokenSwapAmountCalculate,
  usdtToLbtcSwapAmountCalculate,
} from '../../lib/bitmatrix';
import { IWallet } from '../../lib/wallet/IWallet';
import { Wallet } from '../../lib/wallet';
import { useContext } from 'react';
import SettingsContext from '../../context/SettingsContext';
import './Swap.scss';

export const Swap = (): JSX.Element => {
  // <SwapMainTab />
  // <SwapFromTab />
  const [selectedFromAmountPercent, setSelectedFromAmountPercent] =
    useState<FROM_AMOUNT_PERCENT>();
  // <SwapAssetList />
  const [selectedAssetFrom, setSelectedAssetFrom] = useState<SWAP_ASSET>(
    SWAP_ASSET.LBTC,
  );
  const [selectedAssetTo, setSelectedAssetTo] = useState<SWAP_ASSET>(
    SWAP_ASSET.USDT,
  );
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

  const { payloadData } = useContext(SettingsContext);

  document.title = ROUTE_PATH_TITLE.SWAP;

  useEffect(() => {
    setWallet(new Wallet(WALLET_NAME.MARINA));
  }, []);

  const assetAmountToFromAmount = useCallback(
    (
      newAssetAmountList: AssetAmount[],
      newFromAmountPercent?: FROM_AMOUNT_PERCENT,
    ) => {
      let newFromAmount = 0;
      if (selectedAssetFrom === SWAP_ASSET.LBTC)
        newFromAmount =
          newAssetAmountList.find(
            (assetAmount) => assetAmount.assetId === ASSET_ID.LBTC,
          )?.amount || 0;
      else if (selectedAssetFrom === SWAP_ASSET.USDT)
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
    [selectedAssetFrom],
  );

  useEffect(() => {
    assetAmountToFromAmount(assetAmounts, selectedFromAmountPercent);
  }, [assetAmountToFromAmount, assetAmounts, selectedFromAmountPercent]);

  const onChangeFromInput = (
    inputElement: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const inputNum = Number(inputElement.target.value);

    const output =
      selectedAssetFrom === SWAP_ASSET.LBTC
        ? lbtcToTokenSwapAmountCalculate(inputNum, payloadData.slippage)
        : usdtToLbtcSwapAmountCalculate(inputNum, payloadData.slippage);

    setInputFromAmount(inputElement.target.value);
    setInputToAmount(output.toString());
  };

  const onChangeToInput = (
    inputElement: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputToAmount(inputElement.target.value);
    // let newToAmount: number = 0;
    // const inputNumber = Number(inputElement.target.value);
    // if (!isNaN(inputNumber)) {
    //   newToAmount = inputNumber;
    // }
    // setToAmount(newToAmount * 100000000);
  };

  const swapClick = async () => {
    const input1 = lbtcToTokenSwap(Number(inputFromAmount));
    // const input2 = tokenToLBtcSwap(Number(inputFromAmount));

    // const data = await axios.post(
    //   'http://157.230.101.158:9485/rpc',
    //   JSON.stringify({
    //     jsonrpc: '1.0',
    //     id: 'curltest',
    //     method: 'decoderawtransaction',
    //     params: [
    //       '0200000001017f91ae9978e0e5444285e22b9345f8fcb4be6025213e2fb3648336d8e04adb150100000000ffffffff0401499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c14010000000000001d4c002200204ae81572f06e1b88fd5ced7a1a000945432e83e1551e6f721ee9c00b8cc3326001499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c140100000000000002bc002200204ae81572f06e1b88fd5ced7a1a000945432e83e1551e6f721ee9c00b8cc332600ad473806ac73db9705e33cd159cb9a6c2b3a0dd85636443f7a6213cda94b078080837cf889d50f8394925667d81d13828803de26efac7df92f62c427369db40ed8c02b5352a1128f9a606af07a0b37a29efc9cf1f5de02bd7deaa31c1b8741e3da7aa1600148947a548741ac41809946976fa12f82933a44ba101499a818545f6bae39fc03b637f2a4e1e64e590cac1bc3a6f6d71aa4443654c140100000000000001d30000000000000000024830450221008a516febb2f7014a0f911cdd60a09dc7e3f4108e20b73dc5a943f4ac0b5b5570022014ba2a8db8d983274536cdaaf58a58aad519fe775af1501a365edf85dc6e47e901210253b4443cb73ac1dbe0d0e31c9db5cdce831280fd94ba9c13eb1ea0791819d70e0000000000430100012a6d0eda50101658e22485ac6969da6dead981e6337d81eb9877062bfdfe16344c058ae0e2e06126d0c7cc6e1f468598e3897efd3d01b1f92b06698bd9c04f04fd4d0b60230000000000000001029500d12f0f49027e14a5ce84cf2d60e37666283d9c5be82c7803ac52159eb7e637251860b9f696718012de769b20d64c5f1c54646f4bd96a909acdbfb9274fed145d9d67179f899a0d6f9be01e02586dcaf0ed59ae6f6a5bb7a62102354d8fc25f6fe9f46a71931bcfd6258b34ee77f418286946500d53bcfe26533d3922f89bd9054e11e731c97554adfeb6424baf708d179c0c97dbea47b55ef136c0d7bccf41bb421c1f543d31ab062494301a701ff4ef941f744436e367b88525876ae44f0a75101b69aa5417dedcbe5f3a6ffee4fc5db503b12ab71e371dfe014d8af75ea99bed15d8de219f02ef3e588ce36cf29645f2a8e02e91a9e2e4eff1b5a48157485e9b0f3ec9a3ef45987960a0d5cf44e801ab9ac0e4f0a464583fe4e72c5bd84b8f5c9ab3de30425dd10529def8dc144e7cffc033d8fb649cbcbad3f227095f920e9588f2203e85aca0b284adeb58551d574e9876e1bd071d6ced8356772ac8c074d68e40fd8bed41218595fd066a0c629308bba4daeebc69331432265ae1430e39125ef9412086bfc0a15b94b5dbfb12af9a221165da9ce9f25654b81369eb882a452372648d2dd8ca778cb7646c0ec2c1c631ae10c36d4080c6fd370a796818feeae49544927903d6da29cf6dd2327106e0caf35e79fb2048018bddbcec00dd3c229a0a5f15226a4babb63613fe0130fe7bc6bb393a193e749687a24c8b61777cfb8554072c9a0402edf96e0230877cc158f7ea36c12635444e7c1f56e1dfb1261e786553bb0d927103c4165d73654d27ec1083fcbfbbb2892801cc7dd883c6aba0927cfcff7fe9dd9612f003267cbabac1d86169db98fc4a8785ce7246ba2691a85d0fdaad4c21f0a29bffb05e44775fa632b513402315257837131263068ce3d632a09441e493eb0d63d23abf435fa1e1980004456116d75e3ede097a8ab6b46b8be97f507156a9e912248a7cb4fd82d5cd8b4bbe9067b6b51375e48103d56d7891cb6d50288f76a4fb8314c44803d93e95f217f558dcee489aff8da4cd1ff281400ce198ca3447d687a79c196c230e9a9ee7bd2371faead65140d25ead47108b6d5aadea93155704e681f99c1b60b3cd76b66af03927ba2d657bc7a34b97c1d6ec8bf949a7f3bb1df3faeb39296203a81a5030543568f23bd28c0b2eea595b7b4eaaf0d20c7da942bdc346542fb4f692d107f14fdbec4b3f07e4ce546abf0526dc9e3857cc31d03d71fd7396e11343bd6decf0221171361870cb295fe0d6aa68f34260d52837a9e1b817cf724a524229daff3d04654ef5aeab6f9b5447beb6471331e221199c3edb90680835dd8edcef0f5805a428f5490b4b7d9d40e7a4f36636079dc07c669ec58ddfa19df78822abe6ad12b989cfb7b7aabe94f7b95c3f8efb9a24dd93a9a36eaf3543003be2caa37de5fc8fd639995547ce407b7bd761113df6fb916493dc43e15a5d7d10fd2f47cd54291bd8df0e4117971272eecb08b112a22b6e13255460bae54b33fc3d93748235c476b6d7837d5665bd5b72bd04dbbfd49b38335c6160e34f4ae8164ff7a9aa3a01fe3ce80b610690b058fae189b688b381c2ddb45be23e849bb9417c8e88aea59a9b7d40fce8a9dc6daad9dad2c5212a6dbffcf662ab7f7ee956e733d54e486dd0d76f8ffae71b130aacc598ed3de29be583a1a290970441041e9e79b5fa3d692fb598c6f4c67b0aa2265e68bb2f5d5f27a0fba093fed16c7d8b9de4e5a4e55f75723adc1196c9e9ab62fe0ce5bbcc825f5dbef40209aa34bfb8105b22c4c234b5a28431f39c3b8ee6ac3dfd17468dd2df7a9e54f98fd4e419b46e18bc147d1e5df8123899a8af53cfd0ce600b0dd69514e9ed9b3de38d0b5cc6ae783d6bec5d3943468c5fd25675fd3f4e2bf67e9127fdcaab8165e9a1cfd31e3665509829f3e12dbcd95af4066e2d67517a3aec58cbfddb5f5551dc7fd4f1fbf1a6a0bd9b0336ce8a8394f8bcda083da15e37b09d80519eb069969f87d762bd5ce4478197b4b021d300a4eef4779e8ad5559b62c510111f1be2f1aebb8f369e2e08bad2128799b5760208394c8b6e079de2f71b89b770b192135fd6eff2bdaf4a65dd05ce66ac82736acc682fcaa4416fcb2ddd11d0f3c76e91b876508231f820aa981c56f084559813efc25d314057f93bff73f880db592926ae928593f9a0784e742136c88331d372d48b50b4820c80de3ea06f5f318eb3d141666b3e51c9c556a7fd273ba7c45323bd318d85a88023bc011fb9627070dc1bac3456974b16eefe13f9582fcf90af5b1df080ae0532b76d9660cb2941e444964dee419516620ad45d5a8310ba1f6acc6bfc373ece0b782f7b7510e2205a343b1e135d3e72d1bb5b8c92a4c25b3eb54630e1f95391b6926a673ab3b8d1e52fdacc4804e7cdfe02e544757008a5523a445ebb178e00c2e013ec634c6a114cdf66a86d238e3d4a9976f7b743f7b1f13c7d514cbe00a350ec50934327e573b9fb7571b14804a40d46845e6a467d86d3dac773dd783a3d27538bbb529c56a80cf24af593986ec19b99a5344a3b6838f17caf70e1bd3de9452dcb4d6fa8b9e49de83c77d189445a88c55322b91487887cd5ccccd42d4140357faa7e5d3741c3be625d63ee32f8512ee9b6c02553a442ae8a3dc6f934c0e1163f6bf055e6d6e32507095481a7e3c6a68a8c1a16eec9ecc471377bbaf9f56128d0abbec2299b6d18c80044b14ece323974b2efc463481beead2f2b1624305e9911c03debe397c96cc746d7ab72452340d7cf6dfac85953913dda1f151e2baac1ec3eec6f9d0e3f35289a2c3b9d35734cfd2ba6c8ee936efe13dc0fe6f3f974c0a40c3cccee5ac2a57889c20fe05aa5868835e8c9762a3a570b2eb0cad2bbb8e76691a36978858d59d38cb7cc3476758d567d9e2057ada204baa129d9e4a1607ea6657100fbf7ccad20ed9be2d2164a235be013f2e654d43a19405c24994e41b39a401d5970aa0c4538a62a30a44a73c1c763c0e95d22e72ce0c6d7770df1bce9cdc096eb313da7dddfea62075d9c9b229ff98f8a50d5d01cf337fdd55241693031d5161ec85968e3b1b0aae0e96d5c4b0840f808657c0c352978542d72229a93b9d01e41b7cf340d7e508922b633b192a57ec722756f54538fc9cb88d64ce6e07d6fd5c6147fdb1e5c4bd2391f58e635c97ea272967a9ad29e47206fc698b1e8473872103d53a6ffd9cbf221f00add0fec16bc76d69758e78ae70a51afc38f926138371e8db034476c94ad0ef7cf98621c389f524891994a43683c5a19b76fb76c6d87d5635abb42f619cc8fa30b59fdd822f82560aef1565e37ca1958fd191225559f7e7ce1ce512ec07c07970e9d5bcc87cb6a7e2c10ced0169b9eccd5475836eda1df70a6231c42454bc7f07628a60baf8318b4c3c4ede62f8a1e1834dbb5e27a9c399c129d00efad477189cde40eb03eb68a26aa658d1671baa8ad97859573f701c93a3eeebe6ba7c2e26a7791a92ef8031095da704993c3e75cf3957832df7c0a7f90beb91d8b562efa6cbb53737cc5947e48b2a0ef97d20bb793d45bd112facbd623fd99d93fcd0f436c0649e58c4b9be30ffaa4e70f40b89a4383b3b219d52210459e1e47b5d22d39af69eb6d8e6ef3b483751c2fe246fb8d2c3eba5704030b279ba793a97fc302a6bf5c89e8a3f0a53e6f93b91b196ffc69fc4480b4efe23faab86eaddc7dedcc24629c84d8ce6eaa79348a9eec7c082a47f33a9028fb4b6db977498408ab9c1085bb1ec18bda89b5bb94ef1fcc4754458dfb40d3313e4594021d519d0a73a25fe9304eb43da55afdeadd0d6f36976c5b505794655730c4ee226ef7759de349ea76d422cd8111ba862f9b28b9e284849194dc9f0fa6cd5265cecc6325626bd473df2961f482c1aeba5574ba0652588022be44e174a25537a9c097d7457823a59711584fe41d74917a1703036c049c23bf366deb54f759a47617bc603d0702a9a48cb5dfa047d6742a57d0492dbc7717c6763b15dbcaa6aade871d4a86161d13d4cea34ed37be142c367254c4ef2412834e2d6667fd015c4280000',
    //     ],
    //   }),
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
    const rawTxHex = await wallet?.sendTransaction([
      {
        address: input1.fundingOutput1Address,
        value: input1.fundingOutput1Value,
        asset: input1.fundingOutput1AssetId,
      },
      {
        address: input1.fundingOutput2Address,
        value: input1.fundingOutput2Value,
        asset: input1.fundingOutput2AssetId,
      },
    ]);
    console.log(rawTxHex);
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
                  selectedAsset={selectedAssetFrom}
                  setSelectedAsset={setSelectedAssetFrom}
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
                selectedAsset={selectedAssetTo}
                setSelectedAsset={setSelectedAssetTo}
              />
            </div>
            <Button
              appearance="default"
              className="swap-button"
              onClick={() => {
                if (wallet) {
                  swapClick();
                } else {
                  setShowWalletList(true);
                }
              }}
            >
              {wallet ? 'Swap' : 'Connect Wallet'}
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
