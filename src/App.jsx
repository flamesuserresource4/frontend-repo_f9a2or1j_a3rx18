import Hero from './components/Hero'
import ServerGrid from './components/ServerGrid'
import Incidents from './components/Incidents'
import AutomationBuilder from './components/AutomationBuilder'
import Analytics from './components/Analytics'

function Section({ title, children, right }) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <Hero />

        <Section title="Servers">
          <ServerGrid />
        </Section>

        <Section title="Active Incidents">
          <Incidents />
        </Section>

        <Section title="Automation">
          <AutomationBuilder />
        </Section>

        <Section title="Analytics">
          <Analytics />
        </Section>
      </div>
    </div>
  )
}
