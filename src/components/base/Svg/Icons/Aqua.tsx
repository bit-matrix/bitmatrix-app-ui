import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const AquaIcon: React.FC<IconSvg> = ({ className, fill, bgColor, width, height }) => (
  <Svg
    className={className}
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    path="M 0 66.25 L 34.6 97.05 67.55 97.05 100 66.25 49.2 2.2 0 66.25 M 48.35 20.25 Q 49 19.3 49.3 19 49.6 18.7 50.05 18.7 50.45 18.7 52.7 22.4 54.95 26.1 66.25 47.55 69.65 54 70.25 56.2 71.45 59.6 71.45 63.5 71.45 72.4 65.05 78.7 58.85 85.05 49.9 85.05 40.9 85.05 34.55 78.7 28.3 72.4 28.3 63.5 28.3 59.95 29.3 56.8 29.4 56.35 29.6 55.9 30 54.95 30.45 54.05 31.9 50.7 35.15 44.65 47.65 21.2 48.35 20.25 Z"
    viewBox="0 0 100 100"
  ></Svg>
);

export default AquaIcon;
