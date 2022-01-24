import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'rsuite';
import BackIcon from '../Svg/Icons/Back';
import './BackButton.scss';

export const BackButton = (): JSX.Element => {
  const history = useHistory();
  return (
    <Button className="back-button" onClick={() => history.goBack()}>
      <BackIcon width="2.25rem" height="2.25rem" fill="#adfbc4" />
      <div className="back-button-text">L-BTC/USDT</div>
    </Button>
  );
};
