import { NavLink } from 'react-router-dom'
import { RiStoreLine } from 'react-icons/ri'
import { APP_NAME, NAV_CATALOG, NAV_ACCESS } from '@/constants/app'

function NavSection({ label, items }) {
  return (
    <div>
      <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </p>
      {items.map(({ label: itemLabel, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/products'}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? 'bg-admin-sideActive text-white'
                : 'text-gray-400 hover:bg-admin-sideHover hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {itemLabel}
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-admin-sidebar lg:flex">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-admin-primary text-white shrink-0">
          <RiStoreLine className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading text-base font-semibold text-white leading-none">{APP_NAME}</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <NavSection label="Catalog" items={NAV_CATALOG} />
        <NavSection label="Access Control" items={NAV_ACCESS} />
      </nav>
    </aside>
  )
}

export default Sidebar
