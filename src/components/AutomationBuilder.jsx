import { useEffect, useState } from 'react'

const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AutomationBuilder() {
  const [rules, setRules] = useState([])
  const [form, setForm] = useState({
    name: 'High CPU auto-restart',
    description: 'Auto action when CPU sustained high',
    server: 'any',
    if_metric: 'cpu',
    operator: '>=',
    threshold: 80,
    duration_sec: 60,
    then_action: 'restart_service',
    enabled: true,
  })

  const load = async () => {
    const res = await fetch(`${backend}/api/automation-rules`)
    const data = await res.json()
    setRules(data.items || [])
  }

  const create = async (e) => {
    e.preventDefault()
    await fetch(`${backend}/api/automation-rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rule: form })
    })
    await load()
  }

  const toggle = async (id, enabled) => {
    await fetch(`${backend}/api/automation-rules/${id}?enabled=${!enabled}`, {
      method: 'PATCH'
    })
    await load()
  }

  useEffect(() => { load() }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={create} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
        <div className="text-lg font-semibold text-gray-900">New Rule</div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <select className="input" value={form.server} onChange={e=>setForm({...form, server:e.target.value})}>
            {['any','web','db','cache','backup','worker','monitor'].map(o=> <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="input" value={form.if_metric} onChange={e=>setForm({...form, if_metric:e.target.value})}>
            {['cpu','memory','disk'].map(o=> <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="input" value={form.operator} onChange={e=>setForm({...form, operator:e.target.value})}>
            {['>','>=','<','<='].map(o=> <option key={o} value={o}>{o}</option>)}
          </select>
          <input className="input" type="number" value={form.threshold} onChange={e=>setForm({...form, threshold:Number(e.target.value)})} />
          <input className="input" type="number" value={form.duration_sec} onChange={e=>setForm({...form, duration_sec:Number(e.target.value)})} />
          <select className="input" value={form.then_action} onChange={e=>setForm({...form, then_action:e.target.value})}>
            {['restart_service','scale_out','allocate_memory','run_backup'].map(o=> <option key={o} value={o}>{o}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.enabled} onChange={e=>setForm({...form, enabled:e.target.checked})} /> Enabled
          </label>
        </div>
        <button className="mt-2 inline-flex items-center px-3 py-1.5 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700">Create</button>
      </form>

      <div className="space-y-2">
        {rules.length === 0 ? (
          <div className="text-sm text-gray-500">No rules yet.</div>
        ) : rules.map(r => (
          <div key={r.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3">
            <div>
              <div className="text-sm font-medium text-gray-900">{r.name}</div>
              <div className="text-xs text-gray-600">if {r.if_metric} {r.operator} {r.threshold}% for {r.duration_sec}s → {r.then_action} ({r.server})</div>
            </div>
            <button onClick={()=>toggle(r.id, r.enabled)} className={`px-2 py-1 rounded text-xs ${r.enabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {r.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
