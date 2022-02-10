import React, { useState, useMemo, useRef, useEffect } from 'react';
import './ImgLazy.scss';

type Props = {
  src: string;
  alt: string;
  className?: string;
  x?: number;
  y?: number;
  minifyImg?: string;
  objectFit?: 'cover' | 'contain';
};
const imagePlaceholderData =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXQ0NCqqKi6ubnBwMCnpaXPz8+wrq64trbHxsatq6vMzMy1s7PLysqrqanEw8O/vb21desJAAACvUlEQVR4nO3a3ZKrIBBG0WgQFYy8/9tOIpqTiS1mNHWkrb2q5mZyw1f8tcDlAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsJUL5VxwRzfrazpvTDFnjO+Obtp3dEK6ySkidrdEwtsZRmopjdAnf3Tz9qtS+e6qoxu423Ul4fXoBu5WrySsj27gXm4lYGGao5u4RdX3067u1xIW/lkBNFrmpAtW3OFXe9NYHWVOY7fEG0NaBWM2VcF8Ivsqx9mdCW3uEdMVzAdM7lXOznwPR0dI67+QsD86RFL4QsJwdIikMt14W4cQ6pXFqDw6RFIqoX/u5y5Z6mhN6H/v5c1yRp0J2/lH0rU9U0Ir1ZtLxYHGhK1cUDu5FxUmbKdCzDXBWx+aKXAnRtSX0ExzsLfFo6YzhZ029atU4+lLaONPzv+LY/zYjdJU1JcwdtjbujKuPVKVpy6hH84mqvptQNr4b2Fb1JbQxDJz3lmxa/v5TFSXcBiO1XzCtUMndvoTtsP/3TxIjC6sNdoSxk/2ICSMw3d+YqwtYTzTlk6+l345T0K78Mt5Ep6rD4XybCzm9CeMa2kjJIyfxPPiW1tCE69b5rVL3A8r/fvhOBiXahph+GpLON3Uv9Wl09H2CerSoojzzbWvEc14PdEIDzX0JYxrzaV7XTXr8bNfOnHTl9BMX/RNMdycGnML422v8GWhMeE0Tu+6UNd1eN6fneWc5uUo6jc5oMqERSvdJy0E1JmwuM0j9qc6837sf2/3Fu/nNuoT3tnSVVV1uf+50iYeLOpN+DgK9r70Ph4MK0249k7vE3knbL6QMO9HQwvXSX+xcFGVjf3vafIepOLR79/Y7B8o7p2Jec/Cgdv1NjHv50KjKtjWbNHakP0QHbnuukWX+SoKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwP/0AAegXtE+/NFIAAAAASUVORK5CYII=';

const ImgLazy: React.FC<Props> = ({ src, alt, x = 0, y = 0, minifyImg, className = '', objectFit = 'cover' }) => {
  const baseSrc = useMemo(() => (minifyImg ? minifyImg : imagePlaceholderData), [minifyImg, src]);

  const [imageSrc, setImageSrc] = useState<string>(baseSrc);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    let didCancel = false;

    if (imageRef.current && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // when image is visible in the viewport + rootMargin
              if (!didCancel && (entry.intersectionRatio > 0 || entry.isIntersecting)) {
                // console.log('ImgLazy isIntersecting', src);
                setImageSrc(src);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          },
        );

        // console.log('ImgLazy observe', imageSrc);
        observer.observe(imageRef.current);
      } else {
        // Old browsers fallback
        setImageSrc(src);
      }
    }

    return () => {
      didCancel = true;
      // on component unmount, we remove the listner
      if (observer && observer.unobserve) {
        // console.log('ImgLazy unmounted', imageSrc);
        if (imageRef.current) {
          // console.log('ImgLazy unmounted unobserve', imageSrc);
          observer.unobserve(imageRef.current);
        }
      }
    };
  }, [imageSrc, src]);

  const objectFitClasses = objectFit === 'contain' ? 'object-fit-contain' : '';
  const imgLazyLoadingClasses = objectFit === 'contain' ? 'img-lazy-loading black-bg-color' : 'img-lazy-loading';

  const imgClasses =
    imageSrc !== src && imageSrc !== imagePlaceholderData
      ? `img-lazy-img-default img-lazy-img ${className} ${objectFitClasses}`
      : `img-lazy-img-default ${className} ${objectFitClasses}`;

  return (
    <div className="img-lazy">
      <svg className="img-lazy-svg" viewBox={`0 0 ${x} ${y}`} />
      {objectFit === 'contain' ? <div className="bgBlur" style={{ backgroundImage: `url('${baseSrc}')` }} /> : null}
      <div className={imgLazyLoadingClasses}>
        <img ref={imageRef} src={imageSrc} alt={alt} className={imgClasses} />
      </div>
    </div>
  );
};

export default ImgLazy;
