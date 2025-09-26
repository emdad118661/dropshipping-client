// pages/CategoryProducts.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Label, Select } from "flowbite-react";
import ProductCard from "../Products/ProductCard";
import HeadSubhead from "../CommonComponents/HeadSubhead";

const SLUG_TO_TITLE = {
    clothing: "Clothing",
    "traditional-wear": "Traditional Wear",
    footwear: "Footwear",
    accessories: "Accessories",
};

const SORT_PARAM = {
    featured: undefined,     // no sort param -> API order
    nameAsc: "name-asc",
    nameDesc: "name-desc",
    priceAsc: "price-asc",
    priceDesc: "price-desc",
};

export default function CategoryProducts() {
    const { slug } = useParams();

    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState("featured");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // optional pagination
    const [page, setPage] = useState(1);
    const limit = 0; // 0 = no limit; চাইলে 20 দিন

    const API = import.meta.env.VITE_API_URL;

    // API URL build (server-side sort + pagination)
    const apiUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (SORT_PARAM[sortBy]) params.set("sort", SORT_PARAM[sortBy]);
        if (limit) params.set("limit", String(limit));
        if (limit) params.set("page", String(page));
        const query = params.toString();
        // Generic route:
        return `${API}/products/category/${slug}${query ? `?${query}` : ""}`;

        // If you only created fixed routes (/products/clothing etc) use:
        // return `${API}/products/${slug}${query ? `?${query}` : ""}`;
    }, [API, slug, sortBy, page, limit]);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError("");

        fetch(apiUrl, { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => setProducts(data))
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Failed to load products");
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [apiUrl]);

    // slug বদলালে পেজ/সোর্ট reset করতে চাইলে:
    useEffect(() => {
        setSortBy("featured");
        setPage(1);
    }, [slug]);

    return (
        <div className="px-4 mx-auto mt-10 max-w-7xl sm:px-6 lg:px-8">
                <HeadSubhead
                    title={SLUG_TO_TITLE[slug] || "Category"}
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
                <div className="grid grid-cols-1 gap-5 mt-8 md:grid-cols-2 lg:grid-cols-4">
                    {loading ? (
                        <div className="text-center text-gray-500 col-span-full">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-600 col-span-full">{error}</div>
                    ) : products.length ? (
                        products.map((p) => (
                            <ProductCard key={p._id?.$oid || p._id} product={p} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 col-span-full">No products found</div>
                    )}
                </div>

                {/* Optional simple pagination */}
                {limit > 0 && (
                    <div className="flex justify-center gap-3 mt-6">
                        <button
                            className="px-4 py-2 border rounded-full disabled:opacity-50"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                            Prev
                        </button>
                        <span className="px-2 py-2 text-sm">Page {page}</span>
                        <button
                            className="px-4 py-2 border rounded-full"
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            
        </div>
    );
}