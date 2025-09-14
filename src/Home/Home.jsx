import React from 'react'
import BannerCarousel from './BannerCarousel'
import BestSeller from './BestSeller'
import NewArrival from './NewArrival'

const Home = () => {
  return (
    <div>
      <BannerCarousel></BannerCarousel>
      <BestSeller></BestSeller>
      <NewArrival></NewArrival>
    </div>
  )
}

export default Home