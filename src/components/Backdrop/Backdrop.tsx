/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import './Backdrop.scss';

type Props = {
  show: boolean;
  clicked: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Backdrop: React.FC<Props> = ({ show, clicked }) =>
  show ? <div className="backdrop" onClick={clicked} onKeyDown={() => {}} role="button" tabIndex={0} /> : null;

export default Backdrop;
