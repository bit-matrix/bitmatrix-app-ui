import React, { useContext, useState } from 'react';
import { Loader, Modal } from 'rsuite';
import { MarinaAddressInterface } from '../../lib/wallet/marina/IMarina';
import { UnblindedOutput } from 'ldk';
import importSeed from '../../images/key_1.png';
import marinaWallet from '../../images/marina.png';
import ledgerNano from '../../images/ledger.png';
import generateSeed from '../../images/key_2.png';
import { IWallet } from '../../lib/wallet/IWallet';
import SettingsContext from '../../context/SettingsContext';
import SETTINGS_ACTION_TYPES from '../../context/SETTINGS_ACTION_TYPES';
import { Wallet } from '../../lib/wallet';
import './WalletListModal.scss';

type Props = {
  show: boolean;
  wallet?: IWallet;
  // walletOnClick: (walletName: WALLET_NAME) => void;
  close: () => void;
  setNewAddress?: (newAddress: MarinaAddressInterface) => void;
  setUtxos?: (utxos: UnblindedOutput[]) => void;
};

export const WalletListModal: React.FC<Props> = ({ show, wallet, close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch, payloadData } = useContext(SettingsContext);

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

            dispatch({
              type: SETTINGS_ACTION_TYPES.SET_WALLET,
              payload: {
                ...payloadData,
                wallet: { marina: marinaWallet, isEnabled: true, balances: [] },
              },
            });

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
    <Modal className="wallet-list-modal" size="xs" backdrop={true} show={show} onHide={close}>
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
          <img className="wallet-list-item-icon" src={marinaWallet} alt="Generate Seed" />
          <div>
            <div className="wallet-text-header">{wallet?.exist() ? 'Marina Wallet' : 'Install Marina Wallet'} </div>
            <div className="wallet-list-item-description">
              {' '}
              Connect to Marina wallet to access Bitmatrix directly from your browser.
            </div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <img className="wallet-list-item-icon" src={ledgerNano} alt="Import Seed" />
          <div>
            <div className="wallet-text-header">Ledger Nano</div>
            <div className="wallet-list-item-description">
              Connect to your Ledger Nano device to access to Bitmatrix.
            </div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <img className="wallet-list-item-icon" src={importSeed} alt="Import Seed" />
          <div>
            <div className="wallet-text-header">Import Seed</div>
            <div className="wallet-list-item-description">
              Import your 12-word mnemonic phrases to unlock your coins and start swapping.
            </div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <img className="wallet-list-item-icon" src={generateSeed} alt="Generate Seed" />
          <div>
            <div className="wallet-text-header">Generate Seed</div>
            <div className="wallet-list-item-description">
              Generate new 12-word mnemonic phrases and get strated with Bitmatrix
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
