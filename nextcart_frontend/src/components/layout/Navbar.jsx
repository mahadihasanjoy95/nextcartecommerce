import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  RiSearchLine,
  RiHeart3Line,
  RiHeart3Fill,
  RiShoppingBag3Line,
  RiMenuLine,
  RiCloseLine,
  RiSparklingLine,
  RiUser3Line,
} from 'react-icons/ri'
import { APP_NAME, NAV_LINKS } from '@/constants/app'
import { useAuth } from '@/hooks/useAuth'
import { useBookmarkContext } from '@/context/BookmarkContext'

/**
 * Navbar — sticky top navigation.
 *
 * Features:
 *  - Logo + nav links + action icons
 *  - Adds shadow when user scrolls down
 *  - Mobile hamburger menu with slide-down drawer
 *  - Cart icon with badge count (wired to global state later)
 *
 * Future:
 *  - Connect cartCount to cart context/store
 *  - Connect search icon to search overlay/drawer
 */
function Navbar() {
  const [isScrolled,     setIsScrolled]     = useState(false)
  const [isMobileOpen,   setIsMobileOpen]   = useState(false)
  const [isSearchOpen,   setIsSearchOpen]   = useState(false)
  const [searchValue,    setSearchValue]    = useState('')
  const cartCount = 0 // TODO: replace with cart context value
  const { user, isAuthenticated } = useAuth()
  const { bookmarkedCount } = useBookmarkContext()
  const userInitial = user?.firstName?.[0]?.toUpperCase() || '?'
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '')
  }, [searchParams])

  // Close mobile menu on navigation
  const closeMobile = () => {
    setIsMobileOpen(false)
    setIsSearchOpen(false)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const nextParams = new URLSearchParams()
    if (searchValue.trim()) {
      nextParams.set('q', searchValue.trim())
    }

    navigate({
      pathname: '/',
      search: nextParams.toString() ? `?${nextParams.toString()}` : '',
    })

    setIsMobileOpen(false)
    if (location.pathname === '/') {
      setTimeout(() => {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-nav' : 'border-b border-gray-100'
      }`}
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-1.5 group"
          >
            <RiSparklingLine className="w-6 h-6 text-brand-pink-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-heading text-xl font-semibold tracking-tight text-gray-900">
              {APP_NAME}
              <span className="text-brand-pink-500">.</span>
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `font-body text-sm font-medium transition-colors duration-200 relative group
                  ${isActive
                    ? 'text-brand-pink-500'
                    : 'text-gray-600 hover:text-brand-pink-500'
                  }`
                }
              >
                {label}
                {/* Animated underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-pink-400 rounded-full transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </nav>

          {/* ── Action icons ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {isSearchOpen && (
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 mr-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">
                <RiSearchLine className="w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search products"
                  className="w-44 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue('')}
                    aria-label="Clear search"
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  >
                    <RiCloseLine className="w-4 h-4" />
                  </button>
                )}
              </form>
            )}

            {/* Search */}
            <button
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                isSearchOpen
                  ? 'bg-brand-pink-50 text-brand-pink-500'
                  : 'text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50'
              }`}
            >
              <RiSearchLine className="w-5 h-5" />
            </button>

            {/* Favourites */}
            {isAuthenticated ? (
              <Link
                to="/favourites"
                aria-label={`My favourites${bookmarkedCount > 0 ? `, ${bookmarkedCount} saved` : ''}`}
                className="relative p-2.5 rounded-full text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50 transition-all duration-200"
              >
                {bookmarkedCount > 0
                  ? <RiHeart3Fill className="w-5 h-5 text-brand-pink-500" />
                  : <RiHeart3Line  className="w-5 h-5" />
                }
                {bookmarkedCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {bookmarkedCount > 9 ? '9+' : bookmarkedCount}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                to="/login"
                aria-label="Sign in to save favourites"
                className="p-2.5 rounded-full text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50 transition-all duration-200"
              >
                <RiHeart3Line className="w-5 h-5" />
              </Link>
            )}

            {/* Account */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                aria-label="My profile"
                className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-pink-400 to-brand-pink-600
                           flex items-center justify-center text-white text-xs font-bold
                           hover:shadow-glow transition-shadow duration-200"
              >
                {userInitial}
              </Link>
            ) : (
              <Link
                to="/login"
                aria-label="Sign in"
                className="p-2.5 rounded-full text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50 transition-all duration-200"
              >
                <RiUser3Line className="w-5 h-5" />
              </Link>
            )}

            {/* Cart with badge */}
            <button
              aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              className="relative p-2.5 rounded-full text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50 transition-all duration-200"
            >
              <RiShoppingBag3Line className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="md:hidden p-2.5 rounded-full text-gray-500 hover:text-brand-pink-500 hover:bg-brand-pink-50 transition-all duration-200 ml-1"
            >
              {isMobileOpen
                ? <RiCloseLine  className="w-5 h-5" />
                : <RiMenuLine   className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="page-container pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100">
          <form onSubmit={handleSearchSubmit} className="mb-2">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <RiSearchLine className="w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
              />
              <button type="submit" className="text-xs font-semibold text-brand-pink-500">
                Go
              </button>
            </div>
          </form>

          {NAV_LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `font-body text-sm font-medium px-3 py-2.5 rounded-lg transition-colors duration-200
                ${isActive
                  ? 'text-brand-pink-500 bg-brand-pink-50'
                  : 'text-gray-600 hover:text-brand-pink-500 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <hr className="border-gray-100 my-1" />

          {isAuthenticated ? (
            <>
              <NavLink
                to="/favourites"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `font-body text-sm font-medium px-3 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2
                  ${isActive
                    ? 'text-brand-pink-500 bg-brand-pink-50'
                    : 'text-gray-600 hover:text-brand-pink-500 hover:bg-gray-50'
                  }`
                }
              >
                <RiHeart3Fill className="w-4 h-4" />
                My Favourites
                {bookmarkedCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-brand-pink-500 text-white text-[10px] font-bold">
                    {bookmarkedCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/profile"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `font-body text-sm font-medium px-3 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2
                  ${isActive
                    ? 'text-brand-pink-500 bg-brand-pink-50'
                    : 'text-gray-600 hover:text-brand-pink-500 hover:bg-gray-50'
                  }`
                }
              >
                <RiUser3Line className="w-4 h-4" />
                My Account
              </NavLink>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMobile}
              className="font-body text-sm font-medium px-3 py-2.5 rounded-lg transition-colors duration-200
                         text-brand-pink-500 hover:bg-brand-pink-50 flex items-center gap-2"
            >
              <RiUser3Line className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
