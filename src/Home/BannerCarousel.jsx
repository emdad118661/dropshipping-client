import React from 'react'
import { Carousel } from "flowbite-react";
import carouselAsset from '../assets/carousel-asset/clothing.png'
const BannerCarousel = () => {
  return (
    <div className="h-56 sm:h-64 md:h-[500px]">
      <Carousel>
        <img src={carouselAsset} alt="..." />
        <img src={carouselAsset} alt="..." />
        <img src={carouselAsset} alt="..." />
        <img src={carouselAsset} alt="..." />
        <img src={carouselAsset} alt="..." />
      </Carousel>
    </div>
  )
}

export default BannerCarousel