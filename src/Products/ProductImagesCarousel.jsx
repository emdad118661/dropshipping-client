import React, { useRef, useState } from 'react';
import { Carousel } from "flowbite-react";

const ProductImagesCarousel = ({ images = [] }) => {
  const carouselRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const goTo = (i) => {
    if (i === activeIdx) return;         // same index hole setState dorkar nai
    setActiveIdx(i);
    if (carouselRef.current?.slideTo) {
      carouselRef.current.slideTo(i);
    }
  };

  return (
    <div>
      <div className="h-[500px] w-[700px] overflow-hidden rounded-xl bg-gray-50">
        <Carousel
          ref={carouselRef}
          indicators={false}
          // slideInterval={0} // REMOVE: 0 dile bug/loop hote pare
          // slide={false}     // (optional) jodi autoplay bondho rakhte chao, ei line try korte paro (Flowbite version onujayi)
          onSlideChange={(i) => setActiveIdx((prev) => (prev === i ? prev : i))}
          className="w-full h-full"
        >
          {images.map((src, i) => (
            <img key={i} src={src} alt={`product-${i + 1}`} className="object-cover w-full h-full" />
          ))}
        </Carousel>
      </div>

      {/* Thumbnails */}
      <div className="flex items-center justify-center gap-2 pb-1 mt-3 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ring-1 ring-gray-200 transition ${
              activeIdx === i ? "border-black" : "border-transparent hover:border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label={`Show image ${i + 1}`}
            aria-pressed={activeIdx === i}
          >
            <img src={src} alt={`thumb-${i + 1}`} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImagesCarousel;