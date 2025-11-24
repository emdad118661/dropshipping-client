import React from "react";
import HeadSubhead from "../CommonComponents/HeadSubhead";

export default function About() {
  return (
    <div className="mx-auto mt-10 max-w-7xl px-5 md:px-0">
      <HeadSubhead
        title="About Us"
        subtitle="Shop Clothing, Traditional Wear, Footwear & Accessories online in Bangladesh — authentic products, best price, fast delivery and Cash on Delivery."
      />

      <section className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <p className="text-gray-700">
            We built this store to make online shopping in Bangladesh simple and trustworthy.
            From everyday clothing to traditional wear, footwear and accessories — find
            curated, authentic products with clear pricing, size/color options and fast delivery.
          </p>

          <div>
            <h3 className="text-xl font-semibold">What we offer</h3>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-1">
              <li>Clothing: tees, shirts, pants/denim</li>
              <li>Traditional Wear: sarees (jamdani/katan) and more</li>
              <li>Footwear: sneakers, sandals, loafers</li>
              <li>Accessories: bags, ornaments/jewellery, watches</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Why shop with us</h3>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-1">
              <li>Authentic & curated products from trusted suppliers</li>
              <li>Transparent pricing with deals and offers</li>
              <li>Nationwide delivery and Cash on Delivery (COD)</li>
              <li>Size–color variants, zoomable images, clear descriptions</li>
              <li>Secure checkout and order status updates</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">How it works</h3>
            <ol className="mt-3 list-decimal pl-6 text-gray-700 space-y-1">
              <li>Browse by category and pick your product</li>
              <li>Select size/color, then Add to Cart or Buy Now</li>
              <li>Provide delivery address and confirm order</li>
              <li>We ship via courier; you pay on delivery (COD)</li>
            </ol>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">Delivery & Returns</h4>
              <p className="mt-2 text-sm text-gray-700">
                Dhaka: ~2–3 business days; Outside Dhaka: ~3–5 business days (depends on courier/area).
                Returns/exchanges apply as per policy.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold">What’s next</h4>
              <p className="mt-2 text-sm text-gray-700">
                Online payment gateway, order tracking, wishlists and more categories are coming soon.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-semibold">Need help?</h4>
            <p className="mt-2 text-sm text-gray-700">
              Message us anytime or email our support. We usually reply within working hours.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold">Our Categories</h4>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-1">
              <li>Clothing</li>
              <li>Traditional Wear</li>
              <li>Footwear</li>
              <li>Accessories</li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="font-semibold">Trusted shopping</h4>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-1">
              <li>Authentic products</li>
              <li>Secure checkout</li>
              <li>Easy COD</li>
              <li>Fast nationwide delivery</li>
            </ul>
          </div>
        </aside>
      </section>

      <div className="mt-10">
        <a
          href="/products"
          className="inline-flex items-center rounded-full bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Start shopping
        </a>
      </div>
    </div>
  );
}