import React from 'react';
import './ToggleSwitch.scss';

type Props = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
};

export const ToggleSwitch: React.FC<Props> = ({ onChange, checked }) => {
  return (
    <label className="switch">
      <input checked={checked} type="checkbox" onChange={onChange} />
      <span className="slider"></span>
    </label>
  );
};
