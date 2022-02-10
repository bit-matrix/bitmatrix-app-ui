import React from 'react';

type Props = {
  onChange: (inputValue: string) => void;
  inputValue: string;
  className?: string;
  decimalLength?: number;
};

export const NumericalInput: React.FC<Props> = ({ onChange, inputValue, className, decimalLength = 2 }) => {
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d{0,${decimalLength}}$`);

  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const enforcer = (input: string) => {
    if (input === '' || inputRegex.test(escapeRegExp(input))) {
      onChange(input);
    }
  };

  return (
    <input
      className={className}
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      placeholder="0.0"
      spellCheck="false"
      value={inputValue}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
    />
  );
};
