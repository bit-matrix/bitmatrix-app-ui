import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const ExclamationIcon: React.FC<IconSvg> = ({ fill = '#838588', bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    path="M 85.35 85.35
    Q 100 70.7 100 50 100 29.3 85.35 14.65 70.7 0 50 0 29.3 0 14.65 14.65 0 29.3 0 50 0 70.7 14.65 85.35 29.3 100 50 100 70.7 100 85.35 85.35
    M 43.9 14.65
    L 57.15 14.65
    Q 58.6 14.65 59.55 15.7 60.55 16.7 60.5 18.2
    L 58.6 56.4
    Q 58.5 57.8 57.5 58.7 56.55 59.6 55.2 59.6
    L 45.85 59.6
    Q 44.5 59.6 43.55 58.7 42.55 57.8 42.5 56.4
    L 40.55 18.2
    Q 40.5 16.7 41.5 15.65 42.5 14.65 43.9 14.65
    M 50.5 64.15
    Q 52.75 64.15 54.9 65.05 56.95 65.85 58.5 67.4 60.05 68.95 60.85 71 61.75 73.1 61.75 75.35 61.75 77.65 60.85 79.75 60.05 81.75 58.5 83.35 56.95 84.85 54.9 85.75 52.75 86.65 50.5 86.65 48.2 86.65 46.1 85.75 44.15 84.85 42.55 83.35 39.25 80 39.25 75.35 39.25 70.7 42.55 67.4 45.85 64.15 50.5 64.15 Z"
    viewBox="0 0 100 100"
  />
);

export default ExclamationIcon;
