import { CURRENCY_SYMBOL } from '@/constants/app'

/**
 * Formatting utilities — pure functions, no side effects.
 * Import only what you need to keep bundle size minimal.
 */

/**
 * Format a numeric price for display.
 * @param {number|string} amount
 * @param {string} [currency] - 3-letter code e.g. "BDT" (cosmetic only here)
 * @returns {string}  e.g. "৳ 2,999"
 */
export function formatPrice(amount, currency) {
  if (amount == null || amount === '') return ''
  const num = Number(amount)
  if (isNaN(num)) return ''
  return `${CURRENCY_SYMBOL} ${num.toLocaleString('en-BD')}`
}

/**
 * Calculate the discount percentage between base and sale price.
 * @param {number} basePrice
 * @param {number} salePrice
 * @returns {number}  e.g. 15  (percent, floored)
 */
export function discountPercent(basePrice, salePrice) {
  if (!basePrice || !salePrice || salePrice >= basePrice) return 0
  return Math.floor(((basePrice - salePrice) / basePrice) * 100)
}

/**
 * Truncate a string to maxLength characters, appending "…".
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 80) {
  if (!text) return ''
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`
}

/**
 * Derive a display-friendly product URL path for react-router <Link>.
 * @param {object} product
 * @returns {string}  e.g. "/products/classic-blue-denim-jeans"
 */
export function productPath(product) {
  if (!product) return '/'
  return `/products/${product.slug || product.id}`
}
