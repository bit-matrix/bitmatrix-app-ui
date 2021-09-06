import React from 'react';
import './ToggleSwitch.scss';

type Props = {
  onChange: (checked: boolean) => void;
  checked: boolean;
};

export const ToggleSwitch: React.FC<Props> = ({ onChange, checked }) => {
  return (
    <label className="switch">
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
