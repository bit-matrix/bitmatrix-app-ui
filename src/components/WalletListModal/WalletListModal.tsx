import React, { useEffect, useState } from "react";
import { Loader, Modal } from "rsuite";
import { fetchUTXOS } from "../../lib/liquid-dev";
import { Wallet } from "../../lib/wallet";
import { IWallet } from "../../lib/wallet/IWallet";
import { MarinaAddressInterface } from "../../lib/wallet/marina/IMarina";
import { WALLET_NAME } from "../../lib/wallet/WALLET_NAME";
import { UtxoInterface } from "ldk";
import "./WalletListModal.scss";

interface IWalletListModal {
  show: boolean;
  walletOnClick: (walletName: WALLET_NAME) => void;
  close: () => void;
  setNewAddress: (newAddress: MarinaAddressInterface) => void;
  setUtxos: (utxos: UtxoInterface[]) => void;
}

const WalletListModal: React.FC<IWalletListModal> = ({ show, walletOnClick, close, setNewAddress, setUtxos }) => {
  const [wallet, setWallet] = useState<IWallet>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (show) {
      setWallet(new Wallet(WALLET_NAME.MARINA));
    }
  }, [show]);

  const connectWalletOnClick = (): void => {
    wallet?.exist()
      ? wallet.enable().then(() => {
          console.log("successLogin");

          wallet.getNextAddress().then((newAddress: MarinaAddressInterface) => {
            setNewAddress(newAddress);

            wallet.getAddresses().then((addresses) => {
              console.log("addresses", addresses);

              fetchUTXOS(addresses).then((utxos) => {
                console.log("UTXOS", utxos);
                setUtxos(utxos);
                setLoading(false);
                close();
              });
            });
          });
        })
      : window.open("https://chrome.google.com/webstore/detail/marina/nhanebedohgejbllffboeipobccgedhl/related");
  };

  return (
    <Modal className="wallet-list-modal" size="xs" backdrop={true} show={show} onHide={close}>
      {loading ? <Loader className="wallet-list-loading" inverse center /> : null}
      <Modal.Header>
        <Modal.Title>Connect Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="rs-panel rs-panel-default rs-panel-body wallet-list-item"
          onClick={() => {
            setLoading(true);
            connectWalletOnClick();
          }}
        >
          <span className="wallet-text-header">MarinaWallet</span>
          {/* <span>
        Connect to Marina wallet to access Bitmatrix
        <br /> directly from your browser
      </span> */}
        </div>
        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <span className="wallet-text-header">Import Seed</span>
        </div>
        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">
          <span className="wallet-text-header">Generate Seed</span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WalletListModal;
