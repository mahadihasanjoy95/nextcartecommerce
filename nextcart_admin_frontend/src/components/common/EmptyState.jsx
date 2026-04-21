import { RiInboxLine } from 'react-icons/ri'

function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-admin-priLight text-admin-primary mb-4">
        <RiInboxLine className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-base font-semibold text-admin-text">{title}</h3>
      {message && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-admin-textSub">{message}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
