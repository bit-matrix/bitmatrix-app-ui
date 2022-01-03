import React from 'react';
import { Popover, Whisper } from 'rsuite';

type Placement4 = 'top' | 'bottom' | 'right' | 'left';
type Placement8 =
  | 'bottomStart'
  | 'bottomEnd'
  | 'topStart'
  | 'topEnd'
  | 'leftStart'
  | 'rightStart'
  | 'leftEnd'
  | 'rightEnd';
type PlacementAuto =
  | 'auto'
  | 'autoVertical'
  | 'autoVerticalStart'
  | 'autoVerticalEnd'
  | 'autoHorizontal'
  | 'autoHorizontalStart'
  | 'autoHorizontalEnd';

type Placement = Placement4 | Placement8 | PlacementAuto;

type Props = {
  placement: Placement;
  title?: string;
  content: string;
};

export const CustomPopover: React.FC<Props> = ({ placement, title, content, children }) => {
  const speaker = (
    <Popover title={title}>
      <p>{content}</p>
    </Popover>
  );

  return (
    <Whisper trigger="hover" placement={placement} controlId={`control-id-${placement}`} speaker={speaker}>
      {children}
    </Whisper>
  );
};
