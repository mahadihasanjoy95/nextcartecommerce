import { Link } from 'react-router-dom'
import { RiArrowRightLine, RiShieldCheckLine, RiTruckLine, RiRefreshLine } from 'react-icons/ri'
import Button from '@/components/common/Button'

/**
 * HeroSection — full-width landing banner at the top of the homepage.
 *
 * Layout (desktop): two-column — copy left, visual right.
 * Layout (mobile):  single column, visual below copy.
 *
 * "Shop Now" smoothly scrolls to the #products section instead of
 * navigating away, so the user sees the full grid instantly.
 */
function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-pink-50 via-white to-brand-yellow-50">

      {/* ── Decorative background shapes ─────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* Large soft circle — top right */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-pink-100 opacity-40 blur-3xl" />
        {/* Medium circle — bottom left */}
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-brand-yellow-100 opacity-50 blur-3xl" />
        {/* Small accent dot */}
        <div className="absolute top-1/3 left-1/3 w-16 h-16 rounded-full bg-brand-pink-200 opacity-30 blur-xl" />
      </div>

      <div className="page-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 md:py-20 lg:py-24">

          {/* ── Left: Copy ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 animate-slide-up">

            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 bg-white border border-brand-pink-100 rounded-full px-4 py-1.5 w-fit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-pink-400 animate-pulse" />
              <span className="font-body text-xs font-semibold text-brand-pink-500 uppercase tracking-widest">
                New Season Collection
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] text-gray-900">
              Dress with{' '}
              <span className="gradient-text italic">Confidence</span>
              <br />& Style
            </h1>

            {/* Subtext */}
            <p className="font-body text-gray-500 text-lg leading-relaxed max-w-md">
              Explore handpicked fashion that blends premium quality with
              effortless style — curated for the modern woman.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" onClick={scrollToProducts}>
                Shop Now
                <RiArrowRightLine className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" as={Link} to="/?filter=new">
                New Arrivals
              </Button>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-gray-100">
              {[
                { Icon: RiTruckLine,       text: 'Free Shipping' },
                { Icon: RiRefreshLine,     text: 'Easy Returns' },
                { Icon: RiShieldCheckLine, text: 'Secure Checkout' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-gray-400 text-xs font-body">
                  <Icon className="w-4 h-4 text-brand-pink-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual ─────────────────────────────────────────────── */}
          <div className="relative flex items-center justify-center animate-fade-in">

            {/* Main feature card */}
            <div className="relative w-72 md:w-80 lg:w-96">
              {/* Offset shadow card */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-brand-pink-100" />

              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-card-hover bg-white">
                <img
                  src="https://picsum.photos/seed/hero-fashion-main/480/580"
                  alt="Featured fashion product"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />

                {/* Overlay badge — bottom of the card */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                  <p className="font-heading text-white text-sm font-medium">Featured Look</p>
                  <p className="font-body text-white/70 text-xs mt-0.5">Premium Collection 2025</p>
                </div>
              </div>
            </div>

            {/* Floating stat card — top left */}
            <div className="absolute -top-4 -left-4 md:top-4 md:left-0 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 animate-float">
              <div className="w-9 h-9 rounded-full bg-brand-pink-50 flex items-center justify-center shrink-0">
                <span className="text-brand-pink-500 text-lg">✦</span>
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-gray-900 leading-none">23+</p>
                <p className="font-body text-xs text-gray-400 mt-0.5">Products</p>
              </div>
            </div>

            {/* Floating stat card — bottom right */}
            <div className="absolute -bottom-4 -right-4 md:bottom-4 md:right-0 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="flex -space-x-2">
                {['seed/avatar1/32/32','seed/avatar2/32/32','seed/avatar3/32/32'].map((seed) => (
                  <img
                    key={seed}
                    src={`https://picsum.photos/${seed}`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="font-body text-xs font-semibold text-gray-800">Happy Shoppers</p>
                <p className="font-body text-xs text-brand-yellow-500">★★★★★</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
