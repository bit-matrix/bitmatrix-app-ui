import React from 'react';
import { Notification } from 'rsuite';
import { MessageType } from 'rsuite/esm/Notification/Notification';
import './CustomNotify.scss';

type Props = {
  header?: string;
  content: string;
  type?: MessageType;
};

export const CustomNotify: React.FC<Props> = ({ type = 'info', header = type, content }) => {
  const message = (
    <Notification type={type} header={header} closable>
      <div>{content}</div>
    </Notification>
  );

  return <>{message}</>;
};
