import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const BackIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    path="M10.872 3.166a.5.5 0 00-.634-.091l-.072.054-5 4.5a.5.5 0 00-.065.672l.065.071 5 4.5a.5.5 0 00.73-.677l-.061-.066L6.249 8l4.586-4.127a.5.5 0 00.091-.634l-.054-.072z"
  />
);

export default BackIcon;
