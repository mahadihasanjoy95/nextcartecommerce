import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiArrowDownSLine, RiNotification3Line, RiSearch2Line, RiLogoutBoxRLine, RiUserLine } from 'react-icons/ri'
import { useAuth } from '@/hooks/useAuth'

const PAGE_META = {
  '/products/new': { title: 'Add Product' },
  '/products':     { title: 'Products' },
  '/categories':   { title: 'Categories' },
  '/brands':       { title: 'Brands' },
  '/admins':       { title: 'Admin Management' },
  '/customers':    { title: 'Customer Management' },
  '/roles':        { title: 'Roles & Permissions' },
  '/api-maps':     { title: 'API Permission Map' },
  '/profile':      { title: 'My Profile' },
}

function Topbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const key    = Object.keys(PAGE_META).find((k) => pathname.startsWith(k)) ?? '/products'
  const meta   = PAGE_META[key]
  const initials = useMemo(() => {
    if (!user) return 'A'
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'A'
  }, [user])

  const displayName = useMemo(() => {
    if (!user) return 'Admin'
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Admin'
  }, [user])

  const roleLabel = user?.roles?.includes('SUPER_ADMIN') ? 'Super Admin' : 'Admin'

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-admin-border">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">

        {/* Page title */}
        <h2 className="font-heading text-lg font-semibold text-admin-text truncate">
          {meta.title}
        </h2>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 min-w-[200px]">
            <RiSearch2Line className="h-4 w-4 text-admin-textMuted shrink-0" />
            <input
              type="text"
              placeholder="Search…"
              className="w-full bg-transparent text-sm text-admin-text placeholder:text-admin-textMuted outline-none"
            />
          </div>

          {/* Notifications */}
          <button className="rounded-lg border border-admin-border bg-white p-2 text-admin-textSub hover:text-admin-primary hover:border-admin-primary/40 transition-colors">
            <RiNotification3Line className="h-4.5 w-4.5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((current) => !current)}
              className="flex items-center gap-3 rounded-xl border border-admin-border bg-white px-3 py-2 transition-colors hover:border-admin-primary/30 hover:bg-admin-bg"
            >
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={displayName}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-admin-primary/20"
                />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full bg-admin-primary/15 text-sm font-semibold text-admin-primary">
                  {initials}
                </div>
              )}
              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-sm font-semibold text-admin-text">{displayName}</p>
                <p className="text-xs text-admin-textMuted">{roleLabel}</p>
              </div>
              <RiArrowDownSLine className="h-4 w-4 text-admin-textMuted" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-admin-border bg-white p-2 shadow-xl">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-admin-text transition-colors hover:bg-admin-bg"
                >
                  <RiUserLine className="h-4 w-4" />
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <RiLogoutBoxRLine className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
