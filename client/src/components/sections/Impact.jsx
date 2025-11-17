function Impact() {
  const stats = [
    { k: '500kg+', v: 'food waste diverted' },
    { k: '2', v: 'local green products' },
    { k: '4.9★', v: 'community rating' },
  ]
  return (
    <section id="impact" className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-semibold">Our mission & impact</h2>
      <p className="mt-2 text-gray-600">A simple loop: households → food waste → products → healthier soils and livelihoods.</p>
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.k} className="rounded-xl bg-emerald-50 p-6 border border-emerald-100 text-center">
            <div className="text-2xl font-bold text-emerald-700">{s.k}</div>
            <div className="text-gray-600">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Impact
