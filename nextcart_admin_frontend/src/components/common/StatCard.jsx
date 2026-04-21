function StatCard({ label, value, tone = 'default', icon: Icon }) {
  const styles = {
    default: {
      wrapper: 'bg-white border-admin-border',
      label:   'text-admin-textSub',
      value:   'text-admin-text',
    },
    primary: {
      wrapper: 'bg-admin-primary border-admin-primary',
      label:   'text-indigo-200',
      value:   'text-white',
    },
    success: {
      wrapper: 'bg-admin-successBg border-admin-success/20',
      label:   'text-admin-success',
      value:   'text-admin-success',
    },
    warning: {
      wrapper: 'bg-admin-warningBg border-admin-warning/20',
      label:   'text-admin-warning',
      value:   'text-admin-warning',
    },
  }

  const s = styles[tone] ?? styles.default

  return (
    <div className={`rounded-xl border p-5 shadow-card ${s.wrapper}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${s.label}`}>{label}</p>
          <p className={`mt-2 font-heading text-3xl font-semibold leading-none ${s.value}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-lg p-2 ${tone === 'default' ? 'bg-admin-priLight text-admin-primary' : 'bg-white/20 text-white'}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
