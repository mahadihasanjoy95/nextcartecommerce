import { Outlet, Link } from 'react-router-dom'
import { RiSparklingLine } from 'react-icons/ri'
import { APP_NAME, APP_TAGLINE } from '@/constants/app'

function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface">

      {/* ── Decorative brand panel (desktop only) ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden
                      bg-gradient-to-br from-brand-pink-500 via-brand-pink-600 to-brand-pink-700
                      flex-col items-center justify-center p-12 text-white">

        {/* Background decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 animate-float" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-12 w-20 h-20 rounded-full bg-white/10 animate-float" style={{ animationDelay: '0.8s' }} />

        <div className="relative z-10 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <RiSparklingLine className="w-10 h-10 text-brand-yellow-300 animate-float" />
            <span className="font-heading text-4xl font-bold tracking-tight">
              {APP_NAME}<span className="text-brand-yellow-300">.</span>
            </span>
          </div>

          <p className="font-heading text-xl text-white/80 tracking-wide">
            {APP_TAGLINE}
          </p>

          <div className="w-16 h-0.5 bg-white/30 mx-auto rounded-full" />

          <p className="font-body text-sm text-white/60 max-w-xs mx-auto leading-relaxed">
            Discover curated fashion collections that define your style. Premium quality, timeless elegance.
          </p>
        </div>
      </div>

      {/* ── Form panel ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">

          {/* Mobile-only brand header */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-1.5 mb-10 group">
            <RiSparklingLine className="w-6 h-6 text-brand-pink-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-heading text-xl font-semibold tracking-tight text-gray-900">
              {APP_NAME}<span className="text-brand-pink-500">.</span>
            </span>
          </Link>

          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
