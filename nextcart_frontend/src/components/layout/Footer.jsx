import { Link } from 'react-router-dom'
import {
  RiInstagramLine,
  RiFacebookCircleLine,
  RiTwitterXLine,
  RiPinterestLine,
  RiSparklingLine,
  RiMailLine,
} from 'react-icons/ri'
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from '@/constants/app'

/**
 * Footer — site-wide footer with links, newsletter teaser, and social icons.
 *
 * Structure:
 *   Brand blurb | Shop links | Help links | Newsletter CTA
 *   ─────────────────────────────────────────────────────
 *   Social icons | Copyright
 */
function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-gray-400">

      {/* ── Main footer grid ───────────────────────────────────────────── */}
      <div className="page-container py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-1.5 w-fit">
            <RiSparklingLine className="w-5 h-5 text-brand-pink-400" />
            <span className="font-heading text-lg font-semibold text-white">
              {APP_NAME}<span className="text-brand-pink-400">.</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
            {APP_TAGLINE} — Discover premium fashion curated for the modern woman.
            Style that speaks, quality that lasts.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            {[
              { Icon: RiInstagramLine,      label: 'Instagram' },
              { Icon: RiFacebookCircleLine, label: 'Facebook' },
              { Icon: RiTwitterXLine,       label: 'X (Twitter)' },
              { Icon: RiPinterestLine,      label: 'Pinterest' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-pink-500 hover:text-white transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="font-body font-semibold text-white text-sm mb-4 uppercase tracking-wider">
            Shop
          </h4>
          <ul className="space-y-2.5">
            {FOOTER_LINKS.shop.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  className="text-sm text-gray-500 hover:text-brand-pink-400 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help links */}
        <div>
          <h4 className="font-body font-semibold text-white text-sm mb-4 uppercase tracking-wider">
            Help
          </h4>
          <ul className="space-y-2.5">
            {FOOTER_LINKS.help.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  className="text-sm text-gray-500 hover:text-brand-pink-400 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter teaser */}
        <div>
          <h4 className="font-body font-semibold text-white text-sm mb-4 uppercase tracking-wider">
            Stay in Style
          </h4>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Get the latest drops and exclusive offers straight to your inbox.
          </p>
          <div className="flex rounded-full overflow-hidden border border-gray-700 focus-within:border-brand-pink-400 transition-colors duration-200">
            <div className="flex items-center pl-4 text-gray-500">
              <RiMailLine className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none min-w-0"
            />
            <button className="px-4 py-2.5 bg-brand-pink-500 text-white text-xs font-semibold hover:bg-brand-pink-600 transition-colors duration-200 shrink-0">
              Join
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} {APP_NAME} Fashion House. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
