import React, { useEffect, useState } from 'react'
import HeadSubhead from '../CommonComponents/HeadSubhead'
import ProductCard from './ProductCard'

const Products = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/products")
            .then(res => res.json())
            .then(data => setProducts(data))
    })
    return (
        <div className='mx-auto mt-10 max-w-7xl'>
            <HeadSubhead title="Products" subtitle="Shop all products online in Bangladesh — best price & fast delivery - authentic items, cash on delivery"></HeadSubhead>
            <div className='grid grid-cols-1 gap-5 mt-10 md:grid-cols-2 lg:grid-cols-4'>
                {
                    products.map(product => <ProductCard key={product._id?.$oid || product._id} product={product}></ProductCard>)
                }
            </div>
        </div>
    )
}

export default Products