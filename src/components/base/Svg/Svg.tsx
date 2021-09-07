import React from 'react';
import './Svg.scss';

interface ISvg {
  path: string;
  fill?: string;
  bgColor?: string;
  color?: string;
  size?: string;
  viewBox?: string;
  svgAttribute?: JSX.Element;
  xmlns?: string;
  xmlnsXlink?: string;
  width?: string;
  height?: string;
  className?: string;
}

const Svg: React.FC<ISvg> = ({
  path,
  fill,
  bgColor,
  color,
  size,
  viewBox = '0 0 24 24',
  children,
  width,
  height,
  className,
}) => {
  const style = {
    fill: fill as 'fill',
    fontSize: size as 'fontSize',
    backgroundColor: bgColor as 'backgroundColor',
    color: color as 'color',
  };

  return (
    <svg
      className={`${className} svg-main`}
      style={style}
      viewBox={viewBox}
      width={width}
      height={height}
    >
      <path d={path} />
      {children}
    </svg>
  );
};

export default Svg;
