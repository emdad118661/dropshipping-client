import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineAccountCircle, MdSearch } from 'react-icons/md';
import { LuHeart } from 'react-icons/lu';
import { RiShoppingCartLine } from 'react-icons/ri';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // auth state
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  // search state
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // fetch current user
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API}/auth/me`, { credentials: 'include' });
      if (!res.ok) return setUser(null);
      const data = await res.json();
      setUser(data?.user || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => { checkAuth(); }, []);
  // Re-check when route changes (e.g., after login/registration redirect)
  useEffect(() => { checkAuth(); }, [location.pathname]);

  // search: autofocus when shown
  useEffect(() => {
    if (showSearch && inputRef.current) inputRef.current.focus();
  }, [showSearch]);

  // close search on outside/Escape
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

  // close account dropdown on outside/Escape
  useEffect(() => {
    const onKeyDown = (e) => e.key === 'Escape' && setAccountOpen(false);
    const onClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('mousedown', onClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [accountOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    // navigate(`/search?q=${encodeURIComponent(query)}`);
    console.log('Searching for:', query);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      setAccountOpen(false);
      navigate('/');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  const options = (
    <>
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
          <summary className="text-lg font-semibold">Shop All</summary>
          <ul className="z-20 p-2 bg-white">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </details>
      </li>
      <li className="text-lg font-semibold"><a>Best Seller</a></li>
      <li className="text-lg font-semibold"><a>New Arrival</a></li>
      <li className="text-lg font-semibold"><Link to="/about">About</Link></li>

      {/* Mobile-only Wishlist inside dropdown */}
      <li className="md:hidden">
        <a className="flex items-center gap-2">
          <LuHeart className="text-xl" />
          Wishlist
        </a>
      </li>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl navbar bg-base-100">
      {/* LEFT */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-72">
            {options}
          </ul>
        </div>
        <a className="text-xl normal-case btn btn-ghost">daisyUI</a>
      </div>

      {/* CENTER */}
      <div className="hidden navbar-center lg:flex">
        <ul className="px-1 menu menu-horizontal">
          {options}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="gap-4 navbar-end">
        {/* Search (md+ only) */}
        <div className="items-center hidden gap-2 md:flex" ref={wrapperRef}>
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Search"
            onClick={() => setShowSearch((s) => !s)}
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

        {/* Account dropdown */}
        <div
          ref={accountRef}
          className={`dropdown dropdown-end ${accountOpen ? 'dropdown-open' : ''}`}
        >
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            aria-label="Account"
            onClick={() => setAccountOpen((s) => !s)}
          >
            <MdOutlineAccountCircle className="text-2xl" />
          </button>

          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[2] p-2 shadow bg-base-100 rounded-box w-60">
            {user ? (
              <>
                <li className="px-3 py-2 text-sm border-b">
                  <div className="text-gray-500">Signed in as</div>
                  <div className="font-semibold truncate">{user.email}</div>
                </li>
                <li><button onClick={() => { setAccountOpen(false); navigate('/account'); }}>My Account</button></li>
                <li><button onClick={handleLogout} className="text-red-600">Logout</button></li>
              </>
            ) : (
              <>
                <li><button onClick={() => { setAccountOpen(false); navigate('/login'); }}>Login</button></li>
                <li><button onClick={() => { setAccountOpen(false); navigate('/register'); }}>Register</button></li>
              </>
            )}
          </ul>
        </div>

        {/* Wishlist (md+ only on right) */}
        <span className="hidden md:inline-flex">
          <LuHeart className="text-2xl" />
        </span>

        <RiShoppingCartLine className="text-2xl" />
      </div>
    </div>
  );
};

export default Navbar;