import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const ExchangeIcon: React.FC<IconSvg> = ({ fill, bgColor, width, height }) => (
  <Svg
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    viewBox="0 0 1024 1024"
    path="M1024 676.571429v109.714285q0 7.428571-5.428571 12.857143t-12.857143 5.428572H219.428571v109.714285q0 7.428571-5.428571 12.857143T201.142857 932.571429q-6.857143 0-13.714286-5.714286L5.142857 744q-5.142857-5.142857-5.142857-12.571429 0-8 5.142857-13.142857l182.857143-182.857143q5.142857-5.142857 13.142857-5.142857 7.428571 0 12.857143 5.428572T219.428571 548.571429v109.714285h786.285715q7.428571 0 12.857143 5.428572t5.428571 12.857143z m0-310.857143q0 8-5.142857 13.142857l-182.857143 182.857143q-5.142857 5.142857-13.142857 5.142857-7.428571 0-12.857143-5.428572T804.571429 548.571429V438.857143H18.285714q-7.428571 0-12.857143-5.428572T0 420.571429V310.857143q0-7.428571 5.428571-12.857143T18.285714 292.571429h786.285715V182.857143q0-8 5.142857-13.142857t13.142857-5.142857q6.857143 0 13.714286 5.714285l182.285714 182.285715q5.142857 5.142857 5.142857 13.142857z"
  />
);

export default ExchangeIcon;
