import React from 'react'
import BannerCarousel from './BannerCarousel'
import BestSeller from './BestSeller'
import NewArrival from './NewArrival'
import ChooseByCategory from './ChooseByCategory'

const Home = () => {
  return (
    <div>
      <BannerCarousel></BannerCarousel>
      <BestSeller></BestSeller>
      <NewArrival></NewArrival>
      <ChooseByCategory></ChooseByCategory>
    </div>
  )
}

export default Home