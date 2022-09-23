import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const IssueAsset: React.FC<IconSvg> = ({ className, width, height }) => (
  <Svg className={className} width={width} height={height} viewBox="0 0 64 64">
    <g
      xmlns="http://www.w3.org/2000/svg"
      transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
      fill="#000000"
      stroke="none"
    >
      <path d="M352 628 c-7 -7 -12 -19 -12 -28 0 -30 23 -40 94 -40 l71 0 -109 -109 c-86 -86 -107 -113 -104 -132 2 -16 11 -25 27 -27 19 -3 46 18 132 104 l108 108 3 -74 c2 -56 7 -75 21 -84 12 -8 22 -8 35 0 14 10 17 30 20 139 2 85 -1 132 -9 141 -15 19 -259 20 -277 2z" />
      <path d="M6 504 c-12 -31 -7 -479 6 -492 17 -17 479 -17 496 0 9 9 12 70 12 212 l0 200 -35 -34 -35 -34 0 -143 0 -143 -190 0 -190 0 0 190 0 190 143 0 143 0 34 35 34 35 -206 0 c-178 0 -207 -2 -212 -16z" />
    </g>
  </Svg>
);

export default IssueAsset;
