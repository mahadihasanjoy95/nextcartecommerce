/**
 * Skeleton loader — shows animated grey bars instead of a spinner.
 * `rows` controls how many skeleton "rows" to render.
 */
function Loader({ rows = 5 }) {
  return (
    <div className="space-y-3 py-2" aria-busy="true" aria-label="Loading…">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-11 w-11 rounded-lg bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/5 rounded bg-gray-200" style={{ opacity: 1 - i * 0.12 }} />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
          </div>
          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  )
}

export default Loader
