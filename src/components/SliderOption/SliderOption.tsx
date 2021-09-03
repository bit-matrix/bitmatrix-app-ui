import React, { useState } from 'react';
import './SliderOption.scss';

type Props = {
  options: Array<string>;
};

export const SliderOption: React.FC<Props> = ({ options }) => {
  const [value, setValue] = useState<string>(options[0]);

  return (
    <ul className="slider-option-main">
      {options.map((option) => {
        return (
          <li className="slider-option-item">
            <input
              type="radio"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              id="f-option"
              name="rb"
            />
            <label className="slider-option-label" htmlFor="f-option">
              {option}
            </label>
          </li>
        );
      })}
    </ul>
  );
};
