import React from 'react';
import './CheckBox.scss';

type Props<T> = {
  onChange: (option: T, checked: boolean) => void;
  checked: boolean;
  option: T;
};

export const CheckBox = <T extends unknown>({
  onChange,
  checked,
  option,
}: Props<T>): JSX.Element => {
  return (
    <label className="custom-checkbox-container">
      <span
        className={`${
          checked ? 'custom-checkbox-checked' : 'custom-checkbox-unchecked'
        }`}
      >
        {option as string}
      </span>
      <input
        onChange={(event) => onChange(option, !event.target.checked)}
        checked={checked}
        type="checkbox"
        id={option as string}
        name={option as string}
      />
      <span className="checkmark"></span>
    </label>
  );
};
