import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const ExportIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg fill={fill} bgColor={bgColor} width={width} height={height} viewBox="0 0 200.000000 200.000000">
    <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)" stroke="none">
      <path d="M1260 1620 l0 -100 57 0 58 0 -240 -240 -240 -240 73 -72 72 -73 240 240 240 240 0 -58 0 -57 100 0 100 0 0 230 0 230 -230 0 -230 0 0 -100z" />
      <path d="M333 1585 c-17 -7 -36 -22 -42 -34 -8 -13 -11 -209 -11 -617 l0 -598 27 -28 27 -28 601 0 602 0 26 24 c14 13 28 39 32 57 3 19 4 174 3 344 l-3 310 -97 3 -98 3 0 -271 0 -270 -460 0 -460 0 0 460 0 460 270 0 271 0 -3 98 -3 97 -325 2 c-259 2 -331 0 -357 -12z" />
    </g>
  </Svg>
);

export default ExportIcon;
