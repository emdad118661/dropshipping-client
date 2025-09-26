import React, { useEffect, useMemo, useState } from 'react';
import HeadSubhead from '../CommonComponents/HeadSubhead';
import ProductCard from './ProductCard';
import { Label, Select } from 'flowbite-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured'); // default: API order (Featured)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/products`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  // কোন দাম ধরা হবে (salePrice থাকলে সেটাই, নাহলে price)
  const getPrice = (p) => {
    const val = p?.salePrice ?? p?.price;
    const num = Number(val);
    return Number.isFinite(num) ? num : 0;
  };

  // নাম sort করার জন্য locale-aware compare
  const collator = useMemo(
    () => new Intl.Collator(undefined, { sensitivity: 'base', numeric: true }),
    []
  );

  const sortedProducts = useMemo(() => {
    if (sortBy === 'featured') return products; // API order
    const arr = [...products];
    switch (sortBy) {
      case 'nameAsc':
        arr.sort((a, b) => collator.compare(a?.name || '', b?.name || ''));
        break;
      case 'nameDesc':
        arr.sort((a, b) => collator.compare(b?.name || '', a?.name || ''));
        break;
      case 'priceAsc':
        arr.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'priceDesc':
        arr.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      default:
        break;
    }
    return arr;
  }, [products, sortBy, collator]);

  return (
    <div className="mx-auto mt-10 max-w-7xl">
      <HeadSubhead
        title="Products"
        subtitle="Shop all products online in Bangladesh — best price & fast delivery - authentic items, cash on delivery"
      />

      {/* Sort control */}
      <div className="w-48 px-2 mt-5 md:px-0">
        <div className="block mb-2">
          <Label htmlFor="sort-by">Sort By</Label>
        </div>
        <Select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="nameAsc">Alphabetically, A-Z</option>
          <option value="nameDesc">Alphabetically, Z-A</option>
          <option value="priceAsc">Price, low to high</option>
          <option value="priceDesc">Price, high to low</option>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 mt-10 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="text-center text-gray-500 col-span-full">Loading...</div>
        ) : sortedProducts.length ? (
          sortedProducts.map((product) => (
            <ProductCard
              key={product._id?.$oid || product._id}
              product={product}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;