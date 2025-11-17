import { useState } from 'react'

function TabGroup({ tabs }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t, i) => (
          <button key={t.name} onClick={() => setActive(i)} className={`px-3 py-2 text-sm rounded-t-lg ${i === active ? 'bg-white border border-b-white border-gray-200' : 'text-gray-600 hover:text-emerald-700'}`}>{t.name}</button>
        ))}
      </div>
      <div className="p-4 border border-t-0 border-gray-200 rounded-b-lg bg-white">
        {tabs[active]?.content}
      </div>
    </div>
  )
}

export default TabGroup
