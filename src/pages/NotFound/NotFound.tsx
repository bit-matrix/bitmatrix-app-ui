import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';

export const NotFound = (): JSX.Element => {
  document.title = 'Not Found';
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.push({
        pathname: '/',
        state: {
          from: history.location.pathname,
        },
      });
    }, 5000);
  }, [history]);

  return (
    <div>
      <Helmet>
        <title>{ROUTE_PATH_TITLE.NOT_FOUND}</title>
        <meta name="description" content="Page Not Found"></meta>
      </Helmet>
      <h1 style={{ top: '50%', left: '50%' }}>Page not found</h1>
    </div>
  );
};
