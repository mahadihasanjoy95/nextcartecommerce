import {
  RiTruckLine,
  RiRefreshLine,
  RiShieldCheckLine,
  RiAwardLine,
} from 'react-icons/ri'

/**
 * FeatureHighlights — "why shop with us" strip between Hero and Product Grid.
 *
 * Four value-proposition tiles in a responsive row.
 * Purely decorative / informational — no interactivity.
 */

const HIGHLIGHTS = [
  {
    Icon:        RiTruckLine,
    title:       'Free Shipping',
    description: 'On all orders above ৳999',
    color:       'bg-brand-pink-50 text-brand-pink-500',
  },
  {
    Icon:        RiRefreshLine,
    title:       'Easy Returns',
    description: '7-day hassle-free returns',
    color:       'bg-brand-yellow-50 text-brand-yellow-500',
  },
  {
    Icon:        RiShieldCheckLine,
    title:       'Secure Payment',
    description: '100% protected transactions',
    color:       'bg-emerald-50 text-emerald-500',
  },
  {
    Icon:        RiAwardLine,
    title:       'Premium Quality',
    description: 'Curated by style experts',
    color:       'bg-violet-50 text-violet-500',
  },
]

function FeatureHighlights() {
  return (
    <section className="py-10 border-y border-gray-100 bg-white">
      <div className="page-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {HIGHLIGHTS.map(({ Icon, title, description, color }) => (
            <div
              key={title}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left group"
            >
              {/* Icon circle */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${color} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Text */}
              <div>
                <p className="font-body font-semibold text-gray-800 text-sm">{title}</p>
                <p className="font-body text-gray-400 text-xs mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureHighlights
