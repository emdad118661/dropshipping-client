import React from 'react'
import { MdOutlineAccountCircle, MdSearch } from "react-icons/md";
import { LuHeart } from "react-icons/lu";
import { RiShoppingCartLine } from "react-icons/ri";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

const Navbar = () => {
  // search (desktop/tab) state
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (showSearch && inputRef.current) inputRef.current.focus();
  }, [showSearch]);

  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && setShowSearch(false);
    const onClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    if (showSearch) {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('mousedown', onClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [showSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // TODO: navigate(`/search?q=${query}`) or call API
  };

  const options = <>
    {/* Mobile-only Search inside dropdown */}
    <li className="md:hidden">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <MdSearch className="text-xl" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full input input-bordered input-sm"
        />
      </form>
    </li>
    <li>
      <details>
        <summary className='text-lg font-semibold'>Shop All</summary>
        <ul className="z-20 p-2 bg-white">
          <li><a>Submenu 1</a></li>
          <li><a>Submenu 2</a></li>
        </ul>
      </details>
    </li>
    <li className='text-lg font-semibold'><a>Best Seller</a></li>
    <li className='text-lg font-semibold'><a>New Arrival</a></li>
    <li className='text-lg font-semibold'><a>About</a></li>

    {/* Mobile-only Wishlist inside dropdown */}
    <li className="md:hidden">
      <a className="flex items-center gap-2">
        <LuHeart className="text-xl" />
        Wishlist
      </a>
    </li>
  </>

  return (
    <div className="mx-auto max-w-7xl navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          {/* Tip: search input jeno comfortably fit hoy, chaile w-72/w-80 korte paro */}
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-72">
            {options}
          </ul>
        </div>
        <a className="text-xl normal-case btn btn-ghost">daisyUI</a>
      </div>

      <div className="hidden navbar-center lg:flex">
        <ul className="px-1 menu menu-horizontal">
          {options}
        </ul>
      </div>

      <div className="gap-4 navbar-end">
        {/* Search (md+ only) */}
        <div className="items-center hidden gap-2 md:flex" ref={wrapperRef}>
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Search"
            onClick={() => setShowSearch(s => !s)}
          >
            <MdSearch className="text-2xl" />
          </button>

          {showSearch && (
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="h-8 input input-bordered w-44 md:w-64"
                onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
              />
            </form>
          )}
        </div>

        <MdOutlineAccountCircle className="text-2xl" />

        {/* Wishlist (md+ only on right) */}
        <span className="hidden md:inline-flex">
          <LuHeart className="text-2xl" />
        </span>

        <RiShoppingCartLine className="text-2xl" />
      </div>
    </div>
  )
}

export default Navbar