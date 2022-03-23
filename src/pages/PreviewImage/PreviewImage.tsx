import React, { useRef } from 'react';

export const PreviewImage: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (iframeRef !== null && iframeRef.current !== null) {
    const a = iframeRef.current.contentWindow?.document.getElementById('phtml');
    if (a) {
      const r = document.getElementById('root');
      if (r && r.parentNode) {
        r.parentNode.replaceChild(a, r);
      }
    }
  }

  return <iframe id="iphtml" ref={iframeRef} src="./phtml"></iframe>;
};
