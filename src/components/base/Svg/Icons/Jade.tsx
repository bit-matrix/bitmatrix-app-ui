import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const JadeIcon: React.FC<IconSvg> = ({ className, fill, bgColor, width, height }) => (
  <Svg
    className={className}
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    path="M 68.85 52.65 L 52.85 68.9 52.85 99.65 100 52.65 68.85 52.65 M 31.15 52.65 L 0 52.65 47.1 99.65 47.1 68.9 31.15 52.65 M 47.1 30.8 L 47.1 0 0 47.05 31.15 47.05 47.1 30.8 M 52.85 0 L 52.85 30.8 68.85 47.05 100 47.05 52.85 0 Z"
    viewBox="0 0 100 100"
  ></Svg>
);

export default JadeIcon;
