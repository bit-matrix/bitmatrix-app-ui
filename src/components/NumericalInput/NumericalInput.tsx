import React from 'react';

type Props = {
  onChange: (inputValue: string) => void;
  inputValue: string;
  className?: string;
};

export const NumericalInput: React.FC<Props> = ({ onChange, inputValue, className }) => {
  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

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
      pattern="^[0-9]*[.,]?[0-9]*$"
      spellCheck="false"
      value={inputValue}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        enforcer(event.target.value.replace(/,/g, '.'));
      }}
    />
  );
};
