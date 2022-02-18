import React from 'react';

interface Props {
  providers: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>;
  children: React.ReactNode;
}

export const AppContextProvider = (props: Props): JSX.Element => {
  const { providers = [], children, ...rest } = props;

  return (
    <>
      {providers.reduceRight((acc, Comp) => {
        return <Comp {...rest}>{acc}</Comp>;
      }, children)}
    </>
  );
};
