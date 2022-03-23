import React, { useRef } from 'react';
import domtoimage from 'dom-to-image';

// type Props = {
//   refCallback: (ref: HTMLDivElement | null) => void;
// };

export const PreviewLink: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  // refCallback(divRef.current);

  // useEffect(() => {
  //   refCallback(divRef.current);
  // }, [divRef]);

  if (divRef !== null && divRef.current !== null) {
    domtoimage
      .toPng(divRef.current)
      .then((dataUrl) => {
        console.log(dataUrl);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  return (
    <div ref={divRef} style={{ width: '15rem', height: '15rem', background: 'red' }}>
      <span style={{ color: 'white' }}>I am yellow</span>
    </div>
  );
};
