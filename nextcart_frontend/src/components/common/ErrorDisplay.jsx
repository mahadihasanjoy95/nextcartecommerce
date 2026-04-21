import { RiErrorWarningLine, RiRefreshLine } from 'react-icons/ri'
import Button from './Button'

/**
 * ErrorDisplay — shown when an API call fails.
 *
 * Usage:
 *   <ErrorDisplay error={error} onRetry={refetch} />
 *   <ErrorDisplay message="Could not load products." />
 */
function ErrorDisplay({ error, message, onRetry }) {
  const displayMessage =
    message ||
    error?.message ||
    'Something went wrong while loading products. Please try again.'

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
        <RiErrorWarningLine className="w-10 h-10 text-red-400" />
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-xl font-semibold text-gray-800">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-400 font-body text-sm max-w-sm">{displayMessage}</p>
      </div>

      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          <RiRefreshLine className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default ErrorDisplay
