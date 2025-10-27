import React from 'react';
import { Card } from "flowbite-react";
import Stars from '../CommonComponents/Stars';
import { Link } from 'react-router-dom';
import appleWatch from "../assets/bestseller-card/apple-watch.png";

const ProductCard = ({ product }) => {
  const productId = product._id?.$oid || product._id;

  return (
    <div className="h-full mx-16 md:mx-0">
      <Link to={`/products/${productId}`}>
        <Card
          className="flex flex-col justify-between h-full max-w-sm p-2 transition cursor-pointer hover:shadow-lg"
          imgAlt={product.name}
          imgSrc={appleWatch}
        >
          <div className="flex flex-col flex-grow gap-2">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {product.name}
            </h5>
            <p className="text-sm text-gray-700">{product.description}</p>
            <div className="flex items-center gap-2 mt-2 mb-2 text-sm">
              <Stars rating={product.review} />
              <span className="rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                5.0
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            <button
              className="rounded-lg bg-neutral px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-800"
            >
              Add to cart
            </button>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default ProductCard;