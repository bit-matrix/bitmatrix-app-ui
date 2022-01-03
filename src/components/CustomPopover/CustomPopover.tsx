import React from 'react';
import { Popover, Whisper } from 'rsuite';
import './CustomPopover.scss';

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

type OverlayTrigger = 'click' | 'contextMenu' | 'hover' | 'focus' | 'active' | 'none';

type Props = {
  trigger?: OverlayTrigger;
  placement: Placement;
  title?: string;
  content: string;
};

export const CustomPopover: React.FC<Props> = ({ trigger = 'hover', placement, title, content, children }) => {
  const speaker = (
    <Popover className="custom-popover" title={title}>
      <p>{content}</p>
    </Popover>
  );

  return (
    <Whisper trigger={trigger} placement={placement} controlId={`control-id-${title}-${content}`} speaker={speaker}>
      {children}
    </Whisper>
  );
};
