import React from 'react';
import { Button } from 'rsuite';
import BackIcon from '../Svg/Icons/Back';
import './BackButton.scss';

type Props = {
  onClick: () => void;
  buttonText: string;
};

export const BackButton: React.FC<Props> = ({ onClick, buttonText }): JSX.Element => {
  return (
    <Button className="back-button" onClick={onClick}>
      <BackIcon width="2.25rem" height="2.25rem" className="fill-theme-color" />
      <div className="back-button-text">{buttonText}</div>
    </Button>
  );
};
