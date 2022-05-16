import React from 'react';
import ToolsIcon from '../../components/base/Svg/Icons/Tools';
import './Maintenance.scss';

export const Maintenance = (): JSX.Element => {
  return (
    <div className="maintenance">
      <ToolsIcon width="5rem" height="5rem" />
      <div className="maintenance-text">Under Maintenance</div>
    </div>
  );
};
