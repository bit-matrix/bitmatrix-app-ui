/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { ComponentProps, FC } from 'react';

export const combineComponents = (...components: FC<any>[]): FC => {
  return components.reverse().reduce(
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }: ComponentProps<FC>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>,
  );
};
