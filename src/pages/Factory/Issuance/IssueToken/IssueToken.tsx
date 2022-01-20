import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Content, Dropdown, Input, Uploader } from 'rsuite';
import { FileType } from 'rsuite/esm/Uploader/Uploader';
import BackIcon from '../../../../components/base/Svg/Icons/Back';
import './IssueToken.scss';

export const IssueToken = (): JSX.Element => {
  const [tokenName, setTokenName] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const [issuanceAmount, setIssuanceAmount] = useState<string>();
  const [tokenIcon, setTokenIcon] = useState<FileType[]>([]);
  const [precision, setPrecision] = useState();

  const history = useHistory();

  const onSelectPrecision = (eventKey: any) => {
    setPrecision(eventKey);
  };

  return (
    <div className="issue-token-page-main">
      <Content className="issue-token-page-content">
        <Button className="issue-token-page-back-button" onClick={() => history.goBack()}>
          <BackIcon />
          <div className="issue-token-back-text">Token Issuance</div>
        </Button>
        <div>
          <div className="issue-token-page-line-1">
            <div>
              <div>Token Name:</div>
              <Input
                className="issue-token-input"
                value={tokenName}
                onChange={(value: string) => {
                  setTokenName(value);
                }}
              />
            </div>
            <div>
              <div>Issuance Amount:</div>
              <Input
                className="issue-token-input"
                value={issuanceAmount}
                onChange={(value: string) => {
                  setIssuanceAmount(value);
                }}
              />
            </div>
            <div>
              <div>Precision:</div>
              <Dropdown className="issue-token-dropdown" title="1" appearance="default">
                <Dropdown.Item eventKey={1} onSelect={onSelectPrecision}>
                  1
                </Dropdown.Item>
                <Dropdown.Item eventKey={2} onSelect={onSelectPrecision}>
                  2
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
          <div className="issue-token-page-line-2">
            <div>
              <div>Token Symbol:</div>
              <Input
                className="issue-token-input"
                value={tokenSymbol}
                onChange={(value: string) => {
                  setTokenSymbol(value);
                }}
              />
            </div>
            <div>
              <div>Token Icon:</div>
              <Uploader
                className="issue-token-uploader"
                fileList={tokenIcon}
                listType="picture-text"
                action="//jsonplaceholder.typicode.com/posts/"
                onChange={(fileList: FileType[]) => setTokenIcon(fileList)}
              >
                <span>Browse File</span>
              </Uploader>
            </div>
          </div>
          <div className="issue-token-button-content">
            <Button onClick={() => console.log('Issue Token')} className="primary-button issue-token-button">
              Issue Token
            </Button>
          </div>
        </div>
      </Content>
    </div>
  );
};
