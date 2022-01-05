import React from 'react';
import { CheckBox } from '../CheckBox/CheckBox';
import './CheckBoxGroup.scss';

type Props<T> = {
  options: Array<T>;
  onChange: (checkedValue: T | undefined) => void;
  checkedValue: T | undefined;
  className?: string;
  style?: React.CSSProperties;
};

export const CheckBoxGroup = <T extends unknown>({
  options,
  onChange,
  checkedValue,
  className,
  style,
}: Props<T>): JSX.Element => {
  const onChangeValue = (option: T, checked: boolean): void => {
    if (option === checkedValue && checked) {
      onChange(undefined);
    } else {
      onChange(option);
    }
  };

  return (
    <div style={style} className={`checkbox-group-main ${className}`}>
      {options.map((option: T, index: number) => {
        const isSelected = checkedValue === option ? true : false;

        return <CheckBox key={index} option={option} checked={isSelected} onChange={onChangeValue} />;
      })}
    </div>
  );
};
