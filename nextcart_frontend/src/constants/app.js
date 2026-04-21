/**
 * App-wide constants — branding, navigation links, feature flags.
 *
 * Keep UI-facing text here so copy changes happen in one place.
 */

export const APP_NAME    = 'NextCart'
export const APP_TAGLINE = 'Fashion House'

/** Navigation links rendered in Navbar and Footer */
export const NAV_LINKS = [
  { label: 'Home',         path: '/' },
  { label: 'New Arrivals', path: '/?filter=new' },
  { label: 'Featured',     path: '/?filter=featured' },
  { label: 'Sale',         path: '/?filter=sale' },
]

/** Footer column links */
export const FOOTER_LINKS = {
  shop: [
    { label: 'New Arrivals', path: '/?filter=new' },
    { label: 'Featured',     path: '/?filter=featured' },
    { label: 'Sale',         path: '/?filter=sale' },
    { label: 'All Products', path: '/' },
  ],
  help: [
    { label: 'Contact Us',      path: '/contact' },
    { label: 'Size Guide',      path: '/size-guide' },
    { label: 'Shipping Policy', path: '/shipping' },
    { label: 'Return Policy',   path: '/returns' },
  ],
}

/** Product filter tabs shown on the homepage product section */
export const PRODUCT_FILTERS = [
  { key: 'all',      label: 'All Products' },
  { key: 'featured', label: 'Featured' },
  { key: 'new',      label: 'New Arrivals' },
  { key: 'sale',     label: 'Sale' },
]

/** Currency display format used across the app */
export const CURRENCY_SYMBOL = '৳'
