import React from 'react';
import './SliderOption.scss';

type Props = {
  options: Array<string>;
};

export const SliderOption: React.FC<Props> = ({ options }) => {
  return (
    <ul className="slider">
      {options.map((option) => {
        return (
          <li className="slider-item">
            <input type="radio" id="f-option" name="rb" />
            <label htmlFor="f-option">{option}</label>
          </li>
        );
      })}
    </ul>
  );
};
