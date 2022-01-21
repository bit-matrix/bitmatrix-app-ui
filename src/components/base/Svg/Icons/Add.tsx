import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const AddIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    path="M8 1a1 1 0 011 1v12a1 1 0 01-2 0V2a1 1 0 011-1z"
    viewBox="0 0 16 16"
  >
    <path d="M2 7h12a1 1 0 010 2H2a1 1 0 010-2z" />
  </Svg>
);

export default AddIcon;
