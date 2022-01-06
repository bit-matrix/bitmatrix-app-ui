import React from 'react';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import './Stats.scss';

export const Stats = (): JSX.Element => {
  document.title = ROUTE_PATH_TITLE.STATS;

  return (
    <div className="stats-content">
      <span className="no-stats-text">There are no stats yet.</span>
    </div>
  );
};
