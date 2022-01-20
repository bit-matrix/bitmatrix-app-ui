import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const Remove: React.FC<IconSvg> = ({ fill, bgColor, size }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    size={size}
    path="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
  />
);

export default Remove;
