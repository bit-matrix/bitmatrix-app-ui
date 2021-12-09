import React from 'react';
import './ToggleSwitch.scss';

type Props = {
  onChange: (checked: boolean) => void;
  checked: boolean;
  className?: string;
};

export const ToggleSwitch: React.FC<Props> = ({
  onChange,
  checked,
  className,
}) => {
  return (
    <label className={`switch ${className}`}>
      <input
        checked={checked}
        type="checkbox"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.checked)
        }
      />
      <span className="slider"></span>
    </label>
  );
};
