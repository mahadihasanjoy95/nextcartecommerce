function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-admin-text">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-admin-textSub">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export default PageHeader
