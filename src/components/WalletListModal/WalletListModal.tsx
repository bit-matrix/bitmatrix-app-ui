import React, { useState } from 'react';
import { Loader, Modal } from 'rsuite';
import { useWalletContext } from '../../context';
import { UnblindedOutput } from 'ldk';
import { IWallet } from '../../lib/wallet/IWallet';
import { Wallet } from '../../lib/wallet';
import { AddressInterface } from 'marina-provider';
import MarinaIcon from '../base/Svg/Icons/Marina';
import AquaIcon from '../base/Svg/Icons/Aqua';
import JadeIcon from '../base/Svg/Icons/Jade';
import LedgerIcon from '../base/Svg/Icons/Ledger';
import './WalletListModal.scss';

type Props = {
  show: boolean;
  wallet?: IWallet;
  // walletOnClick: (walletName: WALLET_NAME) => void;
  close: () => void;
  setNewAddress?: (newAddress: AddressInterface) => void;
  setUtxos?: (utxos: UnblindedOutput[]) => void;
};

export const WalletListModal: React.FC<Props> = ({ show, wallet, close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setWalletContext } = useWalletContext();

  const connectWalletOnClick = (): void => {
    wallet?.exist()
      ? wallet
          .enable()
          .then(() => {
            // wallet.getNextAddress().then((newAddress: MarinaAddressInterface) => {
            // setNewAddress(newAddress);
            const marinaWallet = new Wallet();

            setLoading(false);
            close();

            setWalletContext({ marina: marinaWallet, isEnabled: true, balances: [] });

            // wallet.getAddresses().then((addresses) => {
            //   //   console.log("addresses", addresses);

            //   fetchUTXOS(addresses).then((utxos) => {
            //     //   console.log("UTXOS", utxos);
            //     setUtxos(utxos);
            //     setLoading(false);
            //     close();
            //   });
            // });
            //});
          })
          .catch(() => {
            wallet.disable();
            setLoading(false);
          })
      : window.open('https://chrome.google.com/webstore/detail/marina/nhanebedohgejbllffboeipobccgedhl/related');
  };

  return (
    <Modal className="wallet-list-modal" size="xs" backdrop={true} open={show} onClose={close}>
      {loading ? <Loader className="wallet-list-loading" inverse center /> : null}
      <Modal.Header className="connect-wallet-header">
        <Modal.Title className="connect-wallet-title">Connect Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ marginTop: '1rem' }}>
        <div
          className="rs-panel rs-panel-default rs-panel-body wallet-list-item"
          onClick={() => {
            if (wallet?.exist()) setLoading(true);
            connectWalletOnClick();
          }}
        >
          <MarinaIcon className="wallet-list-item-icon" />
          <div>
            <div className="wallet-text-header">{wallet?.exist() ? 'Marina Wallet' : 'Install Marina Wallet'} </div>
            <div className="wallet-list-item-description">
              {' '}
              Connect to Marina wallet to access Bitmatrix directly from your browser.
            </div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <AquaIcon className="wallet-list-item-icon" />
          <div>
            <div className="wallet-text-header">Aqua (Soon)</div>
            <div className="wallet-list-item-description">
              Connect to Aqua wallet to access Bitmatrix from your mobile phone.
            </div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <JadeIcon className="wallet-list-item-icon" />
          <div>
            <div className="wallet-text-header">Jade (Soon)</div>
            <div className="wallet-list-item-description">
              Connect to your Jade wallet to access Bitmatrix from secure hardware.
            </div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <LedgerIcon className="wallet-list-item-icon" />
          <div>
            <div className="wallet-text-header">Ledger (Soon)</div>
            <div className="wallet-list-item-description">
              Connect to your Ledger wallet to safely access Bitmatrix.
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
