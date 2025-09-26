import React from 'react'
import clothing from '../assets/Category-feature/Clothing.png'
import accessories from '../assets/Category-feature/Accessories.png'
import traditional from '../assets/Category-feature/Traditional Wear.png'
import footwear from '../assets/Category-feature/Footwear.png'
import HeadSubhead from '../CommonComponents/HeadSubhead'
import { Link } from 'react-router-dom'

const ChooseByCategory = () => {
  return (
    <div className='mx-auto mt-20 max-w-7xl'>
      <HeadSubhead title="Choose by Category" subtitle="Shop by Category: Shoes, Bags, Sarees & Pants — best prices, genuine products, fast delivery."></HeadSubhead>
      <div className='grid grid-cols-1 gap-5 mt-10 mx-9 md:grid-cols-2 lg:grid-cols-4 md:mx-0'>
        <Link to="/category/clothing" className='w-[300px] h-[300px]'>
            <img className='rounded-xl' src={clothing} alt="clothing" />
        </Link>
        <Link to="/category/accessories" className='w-[300px] h-[300px]'>
            <img className='rounded-xl' src={accessories} alt="accessories" />
        </Link>
        <Link to="/category/traditional-wear" className='w-[300px] h-[300px]'>
            <img className='rounded-xl' src={traditional} alt="traditional" />
        </Link>
        <Link to="/category/footwear" className='w-[300px] h-[300px]'>
            <img className='rounded-xl' src={footwear} alt="footwear" />
        </Link>
      </div>
    </div>
  )
}

export default ChooseByCategory