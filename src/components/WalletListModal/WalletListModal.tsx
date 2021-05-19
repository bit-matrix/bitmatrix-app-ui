import React, { useEffect, useState } from "react";
import { Modal, Panel } from "rsuite";
import { Wallet } from "../../lib/wallet";
import { IWallet } from "../../lib/wallet/IWallet";
import { WALLET_NAME } from "../../lib/wallet/WALLET_NAME";
import "./WalletListModal.scss";

interface IWalletListModal {
  show: boolean;
  walletOnClick: (walletName: WALLET_NAME) => void;
  close: () => void;
}

const WalletListModal: React.FC<IWalletListModal> = ({ show, walletOnClick, close }) => {
  const [wallet, setWallet] = useState<IWallet>();

  useEffect(() => {
    if (show) {
      setWallet(new Wallet(WALLET_NAME.MARINA));
    }
  }, [show]);

  return (
    <Modal className="wallet-list-modal" size="xs" backdrop={true} show={show} onHide={close}>
      <Modal.Header>
        <Modal.Title>Connect to a wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel className="agreement-text" bordered>
          By connecting a wallet, you agree to Bitmatrix Terms of Service and acknowledge that you have read and understand the Bitmatrix protocol disclaimer.
        </Panel>
        <div
          className="rs-panel rs-panel-default rs-panel-body wallet-list-item"
          onClick={() => (wallet?.exist() ? wallet.enable() : window.open("https://chrome.google.com/webstore/detail/marina/nhanebedohgejbllffboeipobccgedhl/related"))}
        >
          MarinaWallet
        </div>
        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">Import Seed</div>
        <div className="wallet-list-item rs-panel rs-panel-default rs-panel-body disabled">Generate Seed</div>
      </Modal.Body>
    </Modal>
  );
};

export default WalletListModal;
