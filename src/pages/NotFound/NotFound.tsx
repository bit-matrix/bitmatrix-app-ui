import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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

  return <h1>Page not found</h1>;
};
