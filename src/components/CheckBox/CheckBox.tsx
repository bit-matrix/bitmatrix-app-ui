import { title } from 'process';
import React from 'react';
import './CheckBox.scss';

type Props = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  title: string;
};

export const CheckBox: React.FC<Props> = ({ onChange, checked, title }) => {
  return (
    <label className="custom-checkbox-container">
      <span>{title}</span>
      <input onChange={onChange} checked={checked} type="checkbox" />
      <span className="checkmark"></span>
    </label>
  );
};
