import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import appleWatch from "../assets/bestseller-card/apple-watch.png";
import Stars from '../CommonComponents/Stars';

const ProductCardDetails = () => {
    const { id } = useParams();
    const [product, setProducts] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3000/products/${id}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [id])
    return (
        <div className='mx-auto mt-10 max-w-7xl'>
            <div className='flex gap-10'>
                <div>
                    <img className='w-[700px] h-[500px]' src={appleWatch} alt='apple-watch'></img>
                </div>
                <div>
                    <h2 className='text-3xl font-semibold'>{product.name}</h2>
                    <p>{product.description}</p>
                    <div className="flex gap-5 mt-5">
                        <Stars rating={product.review} />
                        <span className='font-bold'>0 reviews</span>
                    </div>
                    <h2 className='mt-5 text-2xl font-bold'>BDT: {product.price}</h2>
                    <p className='font-bold'>Size</p>
                </div>
            </div>
        </div>
    )
}

export default ProductCardDetails