import React, { ReactNode } from 'react';
import { Notification } from 'rsuite';
import { MessageType } from 'rsuite/esm/Notification/Notification';
import './CustomNotify.scss';

type Props = {
  header?: string;
  type?: MessageType;
  children?: ReactNode;
};

export const CustomNotify = React.forwardRef<HTMLDivElement | null, Props>(
  ({ type = 'info', header = type, children }, ref) => {
    return (
      <Notification ref={ref} className="custom-notify" type={type} header={header} closable>
        {children}
      </Notification>
    );
  },
);
