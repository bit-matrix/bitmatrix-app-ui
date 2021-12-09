import React from 'react';
import './CheckBox.scss';

type Props = {
  onChange: (option: string, checked: boolean) => void;
  checked: boolean;
  option: string;
};

export const CheckBox: React.FC<Props> = ({ onChange, checked, option }) => {
  return (
    <label className="custom-checkbox-container">
      <span
        className={`${
          checked ? 'custom-checkbox-checked' : 'custom-checkbox-unchecked'
        }`}
      >
        {option}
      </span>
      <input
        onChange={(event) => onChange(option, !event.target.checked)}
        checked={checked}
        type="checkbox"
        id={option}
        name={option}
      />
      <span className="checkmark"></span>
    </label>
  );
};
