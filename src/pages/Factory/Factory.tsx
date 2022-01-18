import React from 'react';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import './Factory.scss';

export const Factory = (): JSX.Element => {
  document.title = ROUTE_PATH_TITLE.STATS;

  return (
    <div className="factory-content">
      <span className="no-factory-text">There are no factory yet.</span>
    </div>
  );
};
