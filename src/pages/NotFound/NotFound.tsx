import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const NotFound = (): JSX.Element => {
  document.title = 'Not Found';
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.push('swap');
    }, 5000);
  }, []);

  return <h1>Page not found</h1>;
};
