import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const TetherIcon: React.FC<IconSvg> = ({ fill = 'none', bgColor, width, height, className }) => (
  <Svg className={className} fill={fill} bgColor={bgColor} width={width} height={height} path="" viewBox="0 0 47 48">
    <g fill="#00A478">
      <path
        d="M18.08 47.57C10.296 47.232 3.075 41.85.865 34.523-.848 28.86.074 23.42 2.84 18.243c2.015-3.77 4.92-6.844 7.949-9.81 2.647-2.59 5.416-5.057 7.853-7.85.389-.444.718-.947 1.353-.204 3.074 3.618 6.754 6.651 10.033 10.077 3.05 3.19 5.743 6.612 7.315 10.768 3.535 9.368.556 19.496-9.133 24.414-3.13 1.587-6.005 2.178-10.128 1.931z"
        transform="translate(-254 -226) translate(15 99) translate(180 119) translate(39.261 8) translate(19.914) translate(4.39)"
      />
    </g>
    <g fill="#FFF">
      <path
        d="M8.271 8.792L8.271 4.107 1.463 4.107 1.463 0 20.486 0 20.486 4.165 13.679 4.165 13.679 8.792z"
        transform="translate(-254 -226) translate(15 99) translate(180 119) translate(39.261 8) translate(19.914) translate(12.438 17.584)"
      />
      <path
        d="M12.072 7.805c7.006 0 10.634 1.854 11.071 2.452-.437.598-4.003 1.496-11.07 1.496-7.006 0-10.634-.898-11.072-1.496.438-.658 4.066-2.452 11.071-2.452zm0-.478C5.38 7.327 0 8.643 0 10.257c0 1.615 5.38 2.931 12.072 2.931 6.693 0 12.072-1.316 12.072-2.93 0-1.615-5.38-2.931-12.072-2.931z"
        transform="translate(-254 -226) translate(15 99) translate(180 119) translate(39.261 8) translate(19.914) translate(12.438 17.584)"
      />
      <path
        d="M13.901 10.943V7.451c-.975-.062-2.02-.124-3.066-.124-.975 0-1.881 0-2.787.062v3.492c.836 0 1.812.062 2.787.062 1.045.063 2.09.063 3.066 0zM10.835 13.305c-.975 0-1.881 0-2.787-.058v8.733h5.853v-8.792c-.975.059-2.02.117-3.066.117z"
        transform="translate(-254 -226) translate(15 99) translate(180 119) translate(39.261 8) translate(19.914) translate(12.438 17.584)"
      />
    </g>
  </Svg>
);

export default TetherIcon;