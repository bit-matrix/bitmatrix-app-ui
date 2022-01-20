import { toaster } from 'rsuite';
import { MessageType } from 'rsuite/esm/Notification/Notification';
import { PlacementType } from 'rsuite/esm/toaster/ToastContainer';
import { CustomNotify } from '../CustomNotify/CustomNotify';

export const notify = (content: string, header?: string, type?: MessageType, placement?: PlacementType): string => {
  return toaster.push(<CustomNotify header={header} content={content} type={type} />, { placement });
};
