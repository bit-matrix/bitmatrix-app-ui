import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const AddIcon: React.FC<IconSvg> = ({ fill, bgColor, size }) => (
  <Svg fill={fill} bgColor={bgColor} size={size} path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
);

export default AddIcon;
