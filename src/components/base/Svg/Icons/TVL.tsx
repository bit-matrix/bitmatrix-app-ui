import React from 'react';
import Svg from '../Svg';
import { IconSvg } from './IconSvg';

const TVLIcon: React.FC<IconSvg> = ({ fill = '#AAE0B5', bgColor, width, height, className }) => (
  <Svg
    className={className}
    fill={fill}
    bgColor={bgColor}
    width={width}
    height={height}
    path="
    M 341.4 341.4
    Q 400 282.9 400 200 400 117.15 341.4 58.5 282.9 0 200 0 117.15 0 58.5 58.5 0 117.15 0 200 0 282.9 58.5 341.4 117.15 400 200 400 282.9 400 341.4 341.4
    M 198.05 50.2
    Q 198.3033203125 50.2 198.55 50.2 198.7966796875 50.2 199.05 50.2 202.15 50.2 204.3 52.45 204.4 52.6 221 71.35 240.8 94.4 257.1 116.4 310.9 188.95 310.9 227.4 310.9 250.1 302.1 270.9 293.6 290.95 278.1 306.45 262.6 321.9 242.55 330.4 231.94453125 334.8978515625 220.8 337 210.1626953125 339.1515625 199.05 339.2 198.5505859375 339.2 198.05 339.2 186.96171875 339.1515625 176.35 337 165.20546875 334.8978515625 154.6 330.4 134.5 321.9 119.05 306.45 103.55 290.95 95.05 270.9 86.25 250.1 86.25 227.4 86.25 208.25 99.75 180.4 113.25 152.5 140 116.4 156.3 94.4 176.15 71.35 186.05 59.8 192.85 52.45 194.95 50.2 198.05 50.2
    M 131.4 195.15
    Q 131.6 193.7 130.8 192.5 129.95 191.25 128.55 190.8 128.244140625 190.7125 127.95 190.65 127.3658203125 190.7484375 126.8 191 125.45 191.6 124.8 192.9 118.9 204.75 116.25 214.35 114.25 221.6 114.25 227.1 114.25 242.95 120.4 257.45 126.3 271.45 137.15 282.25 147.95 293.05 161.95 299 172.477734375 303.42890625 183.7 304.7 187.46953125 305.0755859375 191.3 305.1 191.54453125 305.1 191.8 305.1 192.044140625 305.1 192.3 305.1 194.446484375 305.0857421875 196.55 304.95 202.973828125 304.4892578125 209.25 303 210.65 302.7 211.5 301.55 212.4 300.45 212.35 299 212.3 297.6 211.4 296.5 210.5 295.4 209.1 295.15 192.4 291.8 177.85 282.9 163.7 274.3 153.15 261.4 142.6 248.55 136.95 232.95 131.1 216.9 131.1 199.85 131.1 197.7 131.4 195.15 Z"
    viewBox="0 0 400 400"
  />
);

export default TVLIcon;