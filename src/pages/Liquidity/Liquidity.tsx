import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Content, Icon } from 'rsuite';
import AddLiquidity from './AddLiquidity/AddLiquidity';
// import RemoveLiquidity from './RemoveLiquidity/RemoveLiquidity';
import './Liquidity.scss';
import RemoveLiquidity from './RemoveLiquidity/RemoveLiquidity';

enum LIQUIDITY {
  ADD_LIQUIDITY = 'Add',
  REMOVE_LIQUIDITY = 'Remove',
}

const Liquidity = (): JSX.Element => {
  const [liquidity, setLiquidity] = useState<LIQUIDITY>(LIQUIDITY.ADD_LIQUIDITY);

  const history = useHistory();

  return (
    <div className="liquidity-page-main">
      <Content className="liquidity-page-content">
        <Button className="liquidity-page-back-button" onClick={() => history.goBack()}>
          <Icon className="liquidity-back-icon" icon="angle-left" size="4x" />
          <div className="liquidity-back-text">L-BTC/USDT</div>
        </Button>
        {liquidity === LIQUIDITY.ADD_LIQUIDITY ? <AddLiquidity /> : <RemoveLiquidity />}
        <Button
          appearance="default"
          className="liquidity-button"
          onClick={() => {
            liquidity === LIQUIDITY.ADD_LIQUIDITY
              ? setLiquidity(LIQUIDITY.REMOVE_LIQUIDITY)
              : setLiquidity(LIQUIDITY.ADD_LIQUIDITY);
          }}
        >
          {liquidity === LIQUIDITY.ADD_LIQUIDITY ? 'Add Liquidity' : 'Remove Liquidity'}
        </Button>
      </Content>
    </div>
  );
};

export default Liquidity;
