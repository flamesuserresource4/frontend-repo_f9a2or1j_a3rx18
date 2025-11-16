import { useEffect, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Analytics() {
  const [data, setData] = useState(null)

  const load = async () => {
    const res = await fetch(`${backend}/api/analytics`)
    const j = await res.json()
    setData(j)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 4000)
    return () => clearInterval(id)
  }, [])

  if (!data) return <div className="text-gray-500">Loading analytics…</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="rounded-xl bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500">Total Incidents</div>
        <div className="text-2xl font-bold">{data.total_incidents}</div>
      </div>
      <div className="rounded-xl bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500">Active</div>
        <div className="text-2xl font-bold text-amber-600">{data.active}</div>
      </div>
      <div className="rounded-xl bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500">Resolved</div>
        <div className="text-2xl font-bold text-emerald-600">{data.resolved}</div>
      </div>
      <div className="rounded-xl bg-white border border-gray-200 p-4">
        <div className="text-xs text-gray-500">Score</div>
        <div className="text-2xl font-bold text-indigo-700">{data.score}</div>
        <div className="text-[10px] text-gray-500 mt-1">Avg resolve: {data.avg_resolution_seconds ? `${data.avg_resolution_seconds.toFixed(1)}s` : '—'}</div>
      </div>
    </div>
  )
}
