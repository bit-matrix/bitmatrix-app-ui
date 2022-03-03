import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const RewardIcon: React.FC<IconSvg> = ({ fill = '#AAE0B5', bgColor, width, height, className }) => (
  <Svg
    className={className}
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    path="M 85.35 85.35
    Q 100 70.7 100 50 100 29.3 85.35 14.65 70.7 0 50 0 29.3 0 14.65 14.65 0 29.3 0 50 0 70.7 14.65 85.35 29.3 100 50 100 70.7 100 85.35 85.35
    M 82.3 40
    Q 83.15 42.75 81.15 44.75
    L 69.85 55.85
    Q 69.05 56.55 69.25 57.65
    L 71.9 73.25
    Q 72.2 75.45 70.85 77 69.35 78.7 67.3 78.7 66.15 78.7 65.15 78.1
    L 51.2 70.7
    Q 50.2 70.25 49.25 70.7
    L 35.25 78.1
    Q 33.85 78.9 32.2 78.55 30.6 78.25 29.55 77 28.15 75.4 28.5 73.25
    L 31.15 57.65
    Q 31.35 56.55 30.6 55.85
    L 19.25 44.75
    Q 17.3 42.8 18.1 40 19.05 37.25 21.85 36.85
    L 37.5 34.6
    Q 38.5 34.45 39.05 33.5
    L 46.05 19.3
    Q 47.3 16.7 50.2 16.7 53.1 16.7 54.35 19.3
    L 61.35 33.5
    Q 61.85 34.4 62.9 34.6
    L 78.55 36.85
    Q 81.35 37.25 82.3 40 Z"
    viewBox="0 0 100 100"
  />
);

export default RewardIcon;