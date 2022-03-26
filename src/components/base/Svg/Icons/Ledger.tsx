import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const LedgerIcon: React.FC<IconSvg> = ({ className, fill, bgColor, width, height }) => (
  <Svg
    className={className}
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    path=" M 61.95 76.15 L 38.1 76.15 38.1 99.95 61.95 99.95 61.95 76.15 M 23.85 76.15 L 0 76.15 0 84 Q 0 90.55 4.75 95.25 9.4 99.95 16 99.95 L 23.85 99.95 23.85 76.15 M 23.85 38.1 L 0 38.1 0 61.95 23.85 61.95 23.85 38.1 M 23.9 0 L 16.05 0 Q 9.5 0 4.8 4.75 0.1 9.4 0.1 16 L 0.1 23.85 23.9 23.85 23.9 0 M 95.3 95.15 Q 100 90.4 100 83.85 L 100 76.2 76.2 76.2 76.2 99.8 84.05 99.8 Q 90.6 99.8 95.3 95.15 M 95.15 4.75 Q 90.45 0 83.9 0 L 38.1 0 38.1 61.65 99.85 61.65 99.85 16 Q 99.85 9.4 95.15 4.75 Z"
    viewBox="0 0 100 100"
  ></Svg>
);

export default LedgerIcon;
