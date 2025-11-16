import { useEffect, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function IncidentRow({ inc, onResolve }) {
  const sevColor = {
    low: 'bg-emerald-500/20 text-emerald-700',
    medium: 'bg-amber-500/20 text-amber-700',
    high: 'bg-orange-500/20 text-orange-700',
    critical: 'bg-rose-500/20 text-rose-700',
  }[inc.severity] || 'bg-gray-200 text-gray-700'

  return (
    <div className="grid grid-cols-6 gap-2 items-center p-2 rounded-lg bg-white border border-gray-100">
      <div className="col-span-2">
        <div className="text-sm font-medium text-gray-900">{inc.server}</div>
        <div className="text-xs text-gray-500">{inc.type}</div>
      </div>
      <div className="text-xs text-gray-600">{new Date(inc.triggered_at).toLocaleTimeString()}</div>
      <div className="text-xs">
        <span className={`px-2 py-1 rounded ${sevColor}`}>{inc.severity}</span>
      </div>
      <div className="text-xs text-gray-600 truncate">{inc.message}</div>
      <div className="text-right">
        {inc.status === 'active' ? (
          <button
            onClick={() => onResolve(inc)}
            className="text-xs px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Resolve
          </button>
        ) : (
          <span className="text-xs text-gray-400">{inc.status}</span>
        )}
      </div>
    </div>
  )
}

export default function Incidents() {
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      const res = await fetch(`${backend}/api/incidents?limit=20`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    }
  }

  const resolve = async (inc) => {
    try {
      await fetch(`${backend}/api/incidents/${inc.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: {
            incident_id: inc.id,
            action: 'resolve_manual',
            performed_by: 'operator@example.com',
            notes: 'Manual resolution',
            result: 'success',
          }
        })
      })
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No incidents yet. Sit tight…</div>
      ) : (
        items.map((inc) => (
          <IncidentRow key={inc.id} inc={inc} onResolve={resolve} />
        ))
      )}
    </div>
  )
}
