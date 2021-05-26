import React, { useEffect, useState } from "react";
import { Loader, Modal } from "rsuite";
import { fetchUTXOS } from "../../lib/liquid-dev";
import { Wallet } from "../../lib/wallet";
import { IWallet } from "../../lib/wallet/IWallet";
import { MarinaAddressInterface } from "../../lib/wallet/marina/IMarina";
import { WALLET_NAME } from "../../lib/wallet/WALLET_NAME";
import { UtxoInterface } from "ldk";
import "./WalletListModal.scss";
import importSeed from "../../images/key_1.png";
import marinaWallet from "../../images/marina.png";
import ledgerNano from "../../images/ledger.png";
import generateSeed from "../../images/key_2.png";

interface IWalletListModal {
  show: boolean;
  walletOnClick: (walletName: WALLET_NAME) => void;
  close: () => void;
  setNewAddress: (newAddress: MarinaAddressInterface) => void;
  setUtxos: (utxos: UtxoInterface[]) => void;
}

const WalletListModal: React.FC<IWalletListModal> = ({ show, walletOnClick, close, setNewAddress, setUtxos }) => {
  const [wallet, setWallet] = useState<IWallet>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      setWallet(new Wallet(WALLET_NAME.MARINA));
    }
  }, [show]);

  const connectWalletOnClick = (): void => {
    wallet?.exist()
      ? wallet
          .enable()
          .then(() => {
            // wallet.getNextAddress().then((newAddress: MarinaAddressInterface) => {
            // setNewAddress(newAddress);

            wallet.getAddresses().then((addresses) => {
              //   console.log("addresses", addresses);

              fetchUTXOS(addresses).then((utxos) => {
                //   console.log("UTXOS", utxos);
                setUtxos(utxos);
                setLoading(false);
                close();
              });
            });
            //});
          })
          .catch(() => {
            setLoading(false);
          })
      : window.open("https://chrome.google.com/webstore/detail/marina/nhanebedohgejbllffboeipobccgedhl/related");
  };

  return (
    <Modal className="wallet-list-modal" size="xs" backdrop={true} show={show} onHide={close}>
      {loading ? <Loader className="wallet-list-loading" inverse center /> : null}
      <Modal.Header className="connect-wallet-header">
        <Modal.Title className="connect-wallet-title">Connect Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ marginTop: "1rem" }}>
        <div
          className="rs-panel rs-panel-default rs-panel-body wallet-list-item"
          onClick={() => {
            if (wallet?.exist()) setLoading(true);
            connectWalletOnClick();
          }}
        >
          <img className="wallet-list-item-icon" src={marinaWallet} alt="Generate Seed" />
          <div>
            <div className="wallet-text-header">{wallet?.exist() ? "Marina Wallet" : "Install Marina Wallet"} </div>
            <div className="wallet-list-item-description"> Connect to Marina wallet to access Bitmatrix directly from your browser.</div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <img className="wallet-list-item-icon" src={ledgerNano} alt="Import Seed" />
          <div>
            <div className="wallet-text-header">Ledger Nano</div>
            <div className="wallet-list-item-description">Connect to your Ledger Nano device to access to Bitmatrix.</div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <img className="wallet-list-item-icon" src={importSeed} alt="Import Seed" />
          <div>
            <div className="wallet-text-header">Import Seed</div>
            <div className="wallet-list-item-description">Import your 12-word mnemonic phrases to unlock your coins and start swapping.</div>
          </div>
        </div>

        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <img className="wallet-list-item-icon" src={generateSeed} alt="Generate Seed" />
          <div>
            <div className="wallet-text-header">Generate Seed</div>
            <div className="wallet-list-item-description">Generate new 12-word mnemonic phrases and get strated with Bitmatrix</div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WalletListModal;
