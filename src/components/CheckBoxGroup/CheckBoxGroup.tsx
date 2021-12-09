import React from 'react';
import { CheckBox } from '../CheckBox/CheckBox';
import './CheckBoxGroup.scss';

type Props = {
  options: Array<string>;
  onChange: (checkedValues: Array<string>) => void;
  checkedValues: Array<string>;
  className?: string;
  style?: React.CSSProperties;
};

export const CheckBoxGroup: React.FC<Props> = ({
  options,
  onChange,
  checkedValues,
  className,
  style,
}) => {
  const onChangeValue = (option: string, checked: boolean): void => {
    const lastCheckedValues = [...checkedValues];
    if (checked) {
      const selectedValueIndex = lastCheckedValues.findIndex(
        (checkedvalue) => checkedvalue === option,
      );
      lastCheckedValues.splice(selectedValueIndex, 1);
    } else {
      lastCheckedValues.push(option);
    }
    if (lastCheckedValues != undefined) {
      onChange(lastCheckedValues);
    }
  };

  return (
    <div style={style} className={`checkbox-group-main ${className}`}>
      {options.map((option: string, index: number) => {
        const isSelected = checkedValues
          ? checkedValues.includes(option)
          : false;

        return (
          <CheckBox
            key={index}
            option={option}
            checked={isSelected}
            onChange={onChangeValue}
          />
        );
      })}
    </div>
  );
};
