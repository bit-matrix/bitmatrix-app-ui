import React from "react";
import { Modal, Panel } from "rsuite";
import "./WalletListModal.scss";

interface IWalletListModal {
  show: boolean;
  close: () => void;
}

const WalletListModal: React.FC<IWalletListModal> = ({ show, close }) => {
  return (
    <Modal className="wallet-list-modal" size="xs" backdrop={false} show={show} onHide={close}>
      <Modal.Header>
        <Modal.Title>Connect to a wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Panel className="agreement-text" bordered>
          By connecting a wallet, you agree to Bitmatrix Terms of Service and acknowledge that you have read and understand the Bitmatrix protocol disclaimer.
        </Panel>
        <Panel className="wallet-list-item" bordered>
          MarinaWallet
        </Panel>
        <Panel className="wallet-list-item disabled" bordered>
          Import Seed
        </Panel>
        <Panel className="wallet-list-item disabled" bordered>
          Generate Seed
        </Panel>
      </Modal.Body>
    </Modal>
  );
};

export default WalletListModal;
