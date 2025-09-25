import React, { useRef, useState } from "react";
import { Carousel } from "flowbite-react";

const ProductImagesCarousel = ({ images = [] }) => {
  const carouselRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const goTo = (i) => {
    if (i === activeIdx) return;
    setActiveIdx(i);
    if (carouselRef.current?.slideTo) {
      carouselRef.current.slideTo(i);
    }
  };

  return (
    <div className="w-full">
      {/* Main image area: responsive height */}
      <div className="w-full overflow-hidden rounded-xl bg-gray-50 h-64 sm:h-80 md:h-[420px] lg:h-[500px] lg:w-[700px]">
        <Carousel
          ref={carouselRef}
          indicators={false}
          onSlideChange={(i) => setActiveIdx((prev) => (prev === i ? prev : i))}
          className="w-full h-full"
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`product-${i + 1}`}
              className="object-cover w-full h-full select-none"
              draggable={false}
            />
          ))}
        </Carousel>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 pb-1 mt-3 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`shrink-0 overflow-hidden rounded-md border-2 ring-1 ring-gray-200 transition
              ${activeIdx === i ? "border-black" : "border-transparent hover:border-gray-300"}
              focus:outline-none focus:ring-2 focus:ring-blue-500
              h-14 w-14 sm:h-16 sm:w-16`}
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