import React, { useState } from "react";
import HeadSubhead from "../CommonComponents/HeadSubhead";
import { useNavigate } from "react-router-dom";
import {
    FileInput,
    HelperText,
    Label,
    Select,
    Textarea,
    TextInput,
} from "flowbite-react";
import TagsInput from "../CommonComponents/TagsInput";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const AddProducts = () => {
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);

    // basic form fields
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "Clothing",
        description: "",
        sellerName: "",
    });

    const [images, setImages] = useState([]); // [{ file, preview }]
    const [imageError, setImageError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const MAX_IMAGES = 5;

    // ------- image handlers -------
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        let next = [...images];
        let hasOverflow = false;

        for (const file of files) {
            if (next.length >= MAX_IMAGES) {
                hasOverflow = true;
                break;
            }
            const preview = URL.createObjectURL(file);
            next.push({ file, preview });
        }

        if (hasOverflow) {
            setImageError(`You can upload maximum ${MAX_IMAGES} images.`);
        } else {
            setImageError("");
        }

        setImages(next);
        e.target.value = "";
    };

    const handleRemoveImage = (index) => {
        setImages((prev) => {
            const copy = [...prev];
            const removed = copy[index];
            if (removed?.preview) URL.revokeObjectURL(removed.preview);
            copy.splice(index, 1);
            return copy;
        });
        setImageError("");
    };

    // ------- text form handlers -------
    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((f) => ({ ...f, [id]: value }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError("");

            if (!form.name || !form.price || !form.category) {
                setError("Name, price and category are required.");
                setSubmitting(false);
                return;
            }

            // এখন শুধু product data JSON হিসাবে পাঠাচ্ছি,
            // images পরে আলাদা API দিয়ে handle করা যাবে
            const body = {
                name: form.name,
                price: Number(form.price),
                category: form.category,
                description: form.description,
                sellerName: form.sellerName,
                colors: color,
                sizes: size,
                // images: images.map((img) => img.file.name), // চাইলে শুধু file name পাঠাতে পারেন
            };

            const res = await fetch(`${API_BASE_URL}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // cookie-based auth পাঠাতে
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Failed to add product");
            }

            // success হলে admin products পেজে নিয়ে যাব
            navigate("/admin/products");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <HeadSubhead title="Add a New Products" subtitle="" />
            <div className="max-w-7xl mx-auto mt-10">
                <div className="flex gap-4 mt-10">
                    {/* Left column */}
                    <div className="flex-1 min-w-0">
                        {/* Product Name */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Product Name</Label>
                            </div>
                            <TextInput
                                className="w-full"
                                id="name"
                                type="text"
                                sizing="md"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Product Price */}
                        <div className="mt-5">
                            <div className="mb-2 block">
                                <Label htmlFor="price">Product Price</Label>
                            </div>
                            <TextInput
                                className="w-full"
                                id="price"
                                type="number"
                                sizing="md"
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Category */}
                        <div className="mt-5">
                            <div className="mb-2 block">
                                <Label htmlFor="category">Select product category</Label>
                            </div>
                            <Select
                                id="category"
                                required
                                value={form.category}
                                onChange={handleChange}
                            >
                                <option>Clothing</option>
                                <option>Accessories</option>
                                <option>Traditional Wear</option>
                                <option>Footwear</option>
                            </Select>
                        </div>

                        {/* Images */}
                        <div className="mt-5">
                            <Label className="mb-2 block" htmlFor="file-upload-helper-text">
                                Upload up to 5 images
                            </Label>
                            <FileInput
                                id="file-upload-helper-text"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <HelperText className="mt-1">
                                SVG, PNG, JPG or GIF (MAX. 800x400px). You can upload maximum 5
                                images.
                            </HelperText>
                            {imageError && (
                                <p className="mt-1 text-sm text-red-600">{imageError}</p>
                            )}

                            {images.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative rounded border border-gray-200 overflow-hidden"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`Preview ${idx + 1}`}
                                                className="h-32 w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs hover:bg-red-700"
                                                aria-label="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="flex-1 min-w-0">
                        {/* Description */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description">Product Description</Label>
                            </div>
                            <Textarea
                                id="description"
                                required
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Colors */}
                        <div className="mt-6">
                            <div className="block">
                                <Label htmlFor="color">Product Color</Label>
                            </div>
                            <TagsInput
                                id="color"
                                placeholder="Add a color (Press Enter)"
                                value={color}
                                onChange={setColor}
                            />
                        </div>

                        {/* Sizes */}
                        <div className="mt-6">
                            <div className="block">
                                <Label htmlFor="size">Product Size</Label>
                            </div>
                            <TagsInput
                                id="size"
                                placeholder="Add a size (Press Enter)"
                                value={size}
                                onChange={setSize}
                            />
                        </div>

                        {/* Seller Name */}
                        <div className="mt-6">
                            <div className="mb-2 block">
                                <Label htmlFor="sellerName">Product Seller Name</Label>
                            </div>
                            <TextInput
                                className="w-full"
                                id="sellerName"
                                type="text"
                                sizing="md"
                                value={form.sellerName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

                <div className="mt-10">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-lg bg-neutral px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-800 disabled:opacity-60"
                    >
                        {submitting ? "Adding..." : "Add New Product"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProducts;