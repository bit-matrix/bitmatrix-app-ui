import React from 'react';
import domtoimage from 'dom-to-image';

export const PreviewLink: React.FC = () => {
  const myNode = document.getElementById('my-node');

  if (myNode !== null) {
    domtoimage.toJpeg(myNode, { quality: 0.95 }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'my-image-name.jpeg';
      link.href = dataUrl;
      link.click();
      console.log(link);
    });
  }

  return (
    <div id="my-node" style={{ width: '15rem', height: '15rem', background: 'red' }}>
      <span style={{ color: 'white' }}>I am red</span>
    </div>
  );
};
