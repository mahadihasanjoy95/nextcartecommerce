import { RiErrorWarningLine } from 'react-icons/ri'
import Button from './Button'

function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-admin-danger/20 bg-admin-dangerBg p-4">
      <RiErrorWarningLine className="h-5 w-5 text-admin-danger shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-admin-danger">Error</p>
        <p className="mt-0.5 text-sm text-red-600 break-words">{message}</p>
        {onRetry && (
          <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorState
