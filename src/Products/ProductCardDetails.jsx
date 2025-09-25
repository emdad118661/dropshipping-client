import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import appleWatch from "../assets/bestseller-card/apple-watch.png";
import Stars from '../CommonComponents/Stars';
import ProductImagesCarousel from './ProductImagesCarousel';

const ProductCardDetails = () => {
    const { id } = useParams();

    const [product, setProduct] = useState({});      // {} better than []
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [qty, setQty] = useState(1);

    // Fetch product + set defaults once per id
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, { signal: controller.signal });
                const data = await res.json();
                setProduct(data);
                setSelectedSize(Array.isArray(data?.size) && data.size.length ? data.size[0] : null);
                setSelectedColor(Array.isArray(data?.color) && data.color.length ? data.color[0] : null);
                setQty(1);
            } catch (e) {
                if (e.name !== 'AbortError') console.error(e);
            }
        })();
        return () => controller.abort();
    }, [id]);

    // stock clamp
    const stock = Number.isFinite(product?.stock) ? product.stock : 99;
    const dec = () => setQty(q => Math.max(1, q - 1));
    const inc = () => setQty(q => Math.min(stock, q + 1));
    const onQtyInput = (e) => {
        let n = parseInt(e.target.value, 10);
        if (Number.isNaN(n)) n = 1;
        n = Math.max(1, Math.min(stock, n));
        setQty(n);
    };

    // MEMOIZE FALLBACK IMAGES (critical fix)
    const fallbackImages = useMemo(
        () => [appleWatch, appleWatch, appleWatch, appleWatch, appleWatch],
        []
    );
    const images = (Array.isArray(product?.images) && product.images.length)
        ? product.images
        : fallbackImages;

    return (
        <div className='mx-auto mt-10 max-w-7xl'>
            <div className='flex gap-10'>
                {/* key={id} to remount per product */}
                <ProductImagesCarousel key={id} images={images} />

                <div>
                    <h2 className='text-3xl font-semibold'>{product?.name}</h2>
                    <p>{product?.description}</p>
                    <div className="flex gap-5 mt-5">
                        <Stars rating={product?.review ?? 0} />
                        <span className='font-bold'>0 reviews</span>
                    </div>
                    <h2 className='mt-5 text-2xl font-bold'>BDT: {product?.price}</h2>

                    <div className='flex gap-14'>
                        {/* Color selector */}
                        <fieldset className="mt-6">
                            <legend className="block mb-3 text-sm font-semibold text-gray-800">Color</legend>
                            <div className="flex flex-wrap gap-3">
                                {Array.isArray(product?.color) && product.color.length > 0 ? (
                                    product.color.map((c) => (
                                        <label key={c} className="relative">
                                            <input
                                                type="radio"
                                                name={`color-${id}`}
                                                value={c}
                                                className="sr-only peer"
                                                checked={selectedColor === c}
                                                onChange={() => setSelectedColor(c)}
                                            />
                                            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition bg-white border-2 border-gray-200 rounded-full hover:border-gray-300 peer-checked:border-black peer-checked:text-white peer-checked:bg-black peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2">
                                                {c}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">No colors available</span>
                                )}
                            </div>
                            {selectedColor && <p className="mt-2 text-sm text-gray-600">Selected color: {selectedColor}</p>}
                        </fieldset>

                        {/* Size selector */}
                        <fieldset className="mt-6">
                            <legend className="block mb-3 text-sm font-semibold text-gray-800">Size</legend>
                            <div className="flex flex-wrap gap-3">
                                {Array.isArray(product?.size) && product.size.length > 0 ? (
                                    product.size.map((s) => (
                                        <label key={s} className="relative">
                                            <input
                                                type="radio"
                                                name={`size-${id}`}
                                                value={s}
                                                className="sr-only peer"
                                                checked={selectedSize === s}
                                                onChange={() => setSelectedSize(s)}
                                            />
                                            <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition bg-white border-2 border-gray-200 rounded-full hover:border-gray-300 peer-checked:border-black peer-checked:text-white peer-checked:bg-black peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2">
                                                {s}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">No sizes available</span>
                                )}
                            </div>
                            {selectedSize && <p className="mt-2 text-sm text-gray-600">Selected size: {selectedSize}</p>}
                        </fieldset>
                    </div>

                    {/* Quantity selector */}
                    <div className="mt-6">
                        <label htmlFor="qty" className="block mb-2 text-sm font-semibold text-gray-800">
                            Quantity
                        </label>
                        <div className="inline-flex items-center bg-white border border-gray-300 rounded-full" role="group" aria-label="Choose quantity">
                            <button
                                type="button"
                                onClick={dec}
                                disabled={qty <= 1}
                                className="w-10 h-10 text-xl leading-none text-white transition bg-black rounded-l-full disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>
                            <input
                                id="qty"
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                min={1}
                                max={stock}
                                value={qty}
                                onChange={onQtyInput}
                                onWheel={(e) => e.currentTarget.blur()}
                                onKeyDown={(e) => (e.key === 'e' || e.key === '+' || e.key === '-') && e.preventDefault()}
                                className="w-12 bg-transparent text-center text-base text-gray-900 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                aria-live="polite"
                            />
                            <button
                                type="button"
                                onClick={inc}
                                disabled={qty >= stock}
                                className="w-10 h-10 text-xl leading-none text-white transition bg-black rounded-r-full disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                        {Number.isFinite(product?.stock) ? (
                            <p className="mt-1 text-xs text-gray-500">
                                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                            </p>
                        ) : null}
                    </div>
                    {/* Buttons */}
                    <div>
                        <button className='w-full py-3 mt-6 font-semibold text-white transition bg-black rounded-full hover:bg-gray-800'>Add to Cart</button>
                        <button className='w-full py-3 mt-1 font-semibold text-white transition bg-black rounded-full hover:bg-gray-800'>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardDetails;