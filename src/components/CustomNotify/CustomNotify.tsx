import React from 'react';
import { Notification } from 'rsuite';
import { MessageType } from 'rsuite/esm/Notification/Notification';
import './CustomNotify.scss';

type Props = {
  header?: string;
  type?: MessageType;
};

export const CustomNotify: React.FC<Props> = ({ type = 'info', header = type, children }) => {
  return (
    <Notification className="custom-notify" type={type} header={header} closable>
      {children}
    </Notification>
  );
};
