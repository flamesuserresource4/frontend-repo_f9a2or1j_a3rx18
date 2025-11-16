import { useEffect, useState, useMemo } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function StatBadge({ value, label, color }) {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-white/70 backdrop-blur">
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  )
}

function ServerCard({ s }) {
  const statusColor = {
    healthy: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-600',
    down: 'bg-gray-500',
  }[s.status] || 'bg-gray-400'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{s.role.toUpperCase()}</div>
          <div className="text-lg font-semibold text-gray-900">{s.name}</div>
        </div>
        <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatBadge value={`${s.cpu.toFixed(0)}%`} label="CPU" color="text-emerald-700" />
        <StatBadge value={`${s.memory.toFixed(0)}%`} label="Mem" color="text-indigo-700" />
        <StatBadge value={`${s.disk.toFixed(0)}%`} label="Disk" color="text-rose-700" />
      </div>
      <div className="mt-3 text-xs text-gray-600">Services: {s.services?.join(', ') || '—'}</div>
      <div className="mt-1 text-xs text-gray-500">Uptime: {Math.floor((s.uptime_minutes||0)/60)}h</div>
    </div>
  )
}

export default function ServerGrid() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchServers = async () => {
    try {
      const res = await fetch(`${backend}/api/servers`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServers()
    const id = setInterval(fetchServers, 3000)
    return () => clearInterval(id)
  }, [])

  if (loading) return <div className="text-center text-gray-500">Loading servers...</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((s) => (
        <ServerCard key={s.id || s.name} s={s} />
      ))}
    </div>
  )
}
