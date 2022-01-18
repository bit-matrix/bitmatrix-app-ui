import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Content, Dropdown, Icon, Input, Uploader } from 'rsuite';
import { FileType } from 'rsuite/lib/Uploader';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import './Factory.scss';

export const Factory = (): JSX.Element => {
  const [tokenName, setTokenName] = useState<string>();
  const [tokenIcon, setTokenIcon] = useState<FileType[]>([]);

  document.title = ROUTE_PATH_TITLE.STATS;

  const history = useHistory();

  return (
    <div className="factory-page-main">
      <Content className="factory-page-content">
        <Button className="factory-page-back-button" onClick={() => history.goBack()}>
          <Icon className="factory-back-icon" icon="angle-left" size="4x" />
          <div className="factory-back-text">Token Issuance</div>
        </Button>
        <div>
          <div className="factory-page-line-1">
            <div>
              <div>Token Name:</div>
              <Input
                className="factory-input"
                value={tokenName}
                onChange={(value: string) => {
                  setTokenName(value);
                }}
              />
            </div>
            <div>
              <div>Issuance Amount:</div>
              <Input
                className="factory-input"
                value={tokenName}
                onChange={(value: string) => {
                  setTokenName(value);
                }}
              />
            </div>
            <div>
              <div>Precision:</div>
              <Dropdown className="factory-dropdown" title="1" appearance="default">
                <Dropdown.Item>1</Dropdown.Item>
                <Dropdown.Item>2</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
          <div className="factory-page-line-2">
            <div>
              <div>Token Symbol:</div>
              <Input
                className="factory-input"
                value={tokenName}
                onChange={(value: string) => {
                  setTokenName(value);
                }}
              />
            </div>
            <div>
              <div>Token Icon:</div>
              <Uploader
                className="factory-uploader"
                fileList={tokenIcon}
                listType="picture-text"
                action="//jsonplaceholder.typicode.com/posts/"
                onChange={(fileList: FileType[]) => setTokenIcon(fileList)}
              >
                <span>Browse File</span>
              </Uploader>
            </div>
          </div>
          <div className="factory-button-content">
            <Button onClick={() => console.log('Issue Token')} className="primary-button factory-button">
              Issue Token
            </Button>
          </div>
        </div>
      </Content>
    </div>
  );
};
