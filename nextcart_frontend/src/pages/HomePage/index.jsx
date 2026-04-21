import HeroSection from '@/components/home/HeroSection'
import FeatureHighlights from '@/components/home/FeatureHighlights'
import ProductGrid from '@/components/product/ProductGrid'

/**
 * HomePage — customer-facing storefront landing page.
 * Layout (Navbar + Footer) is provided by MainLayout.
 */
function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureHighlights />
      <ProductGrid />
    </>
  )
}

export default HomePage
