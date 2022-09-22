import { toaster } from 'rsuite';
import { CustomNotify } from '../CustomNotify/CustomNotify';
import { MessageType } from 'rsuite/esm/Notification/Notification';
import { PlacementType } from 'rsuite/esm/toaster/ToastContainer';
import ArrowUpIcon from '../base/Svg/Icons/ArrowUp';
import ArrowDownIcon from '../base/Svg/Icons/ArrowDown';

export const notify = (
  content: JSX.Element | string,
  header?: string,
  type?: MessageType,
  placement: PlacementType = 'topEnd',
  duration = 5000,
): any => {
  toaster.push(
    <CustomNotify header={header} type={type}>
      {content}
    </CustomNotify>,
    { placement },
  );

  setTimeout(() => {
    toaster.clear();
  }, duration);
};

export const arrowIconDirection = (direction?: string): JSX.Element => {
  if (direction === 'up') {
    return <ArrowUpIcon fill="#4caf50" />;
  } else {
    return <ArrowDownIcon fill="#f44336" />;
  }
};
