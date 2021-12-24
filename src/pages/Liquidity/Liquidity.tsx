import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Content, Icon } from 'rsuite';
import AddLiquidity from './AddLiquidity/AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity/RemoveLiquidity';
import './Liquidity.scss';

const Liquidity = (): JSX.Element => {
  const history = useHistory();

  return (
    <div className="liquidity-page-main">
      <Content className="liquidity-page-content">
        <Button
          className="liquidity-page-back-button"
          onClick={() => history.goBack()}
        >
          <Icon className="liquidity-back-icon" icon="angle-left" size="4x" />
          <div className="liquidity-back-text">L-BTC/USDT</div>
        </Button>
        <AddLiquidity />

        <Button appearance="default" className="liquidity-button">
          Add Liquidity
        </Button>
      </Content>
    </div>
  );
};

export default Liquidity;
