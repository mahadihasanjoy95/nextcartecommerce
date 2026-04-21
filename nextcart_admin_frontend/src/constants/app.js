import {
  RiApps2Line, RiPriceTag3Line, RiBox3Line, RiAddCircleLine,
  RiTeamLine, RiUserLine, RiShieldLine, RiMapPinLine,
} from 'react-icons/ri'

export const APP_NAME = 'NextCart'

export const NAV_CATALOG = [
  { label: 'Products',    path: '/products',     icon: RiBox3Line      },
  { label: 'Add Product', path: '/products/new', icon: RiAddCircleLine },
  { label: 'Categories',  path: '/categories',   icon: RiApps2Line     },
  { label: 'Brands',      path: '/brands',       icon: RiPriceTag3Line },
]

export const NAV_ACCESS = [
  { label: 'Admins',         path: '/admins',   icon: RiTeamLine   },
  { label: 'Customers',      path: '/customers', icon: RiUserLine  },
  { label: 'Roles',          path: '/roles',    icon: RiShieldLine },
  { label: 'API Permissions', path: '/api-maps', icon: RiMapPinLine },
]

// Keep backward-compat alias used by old Sidebar — will be replaced
export const NAV_ITEMS = NAV_CATALOG
