import React from 'react';
import './StripedRadioButton.scss';

type Props = {
  options: Array<string>;
  onChange: (option: string) => void;
  selectedOption: string;
  name?: string;
};

export const StripedRadioButton: React.FC<Props> = ({
  options,
  selectedOption,
  onChange,
  name = 'stripedRadio',
}) => {
  const defineOptionTitleClassName = (option: string): string => {
    if (option.length <= 2) {
      return 'short-title';
    } else if (option.length > 2 && option.length < 4) {
      return 'middle-title';
    } else if (option.length >= 4 && option.length < 6) {
      return 'long-title';
    } else if (option.length >= 6) {
      return 'too-long-title';
    } else {
      return 'default-title';
    }
  };

  return (
    <ul className="slider-option-main">
      {options.map((option, index) => {
        return (
          <li key={`${index}-${option}`} className="slider-option-item">
            <input
              type="radio"
              defaultChecked={selectedOption === option}
              value={option}
              id={option}
              name={name}
            />
            <label
              onClick={() => onChange(option)}
              className="slider-option-label"
              htmlFor={option}
            />
            <span
              className={`slider-option-title ${
                selectedOption === option
                  ? 'selected-title'
                  : 'unselected-title'
              } ${defineOptionTitleClassName(option)}`}
            >
              {option}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
