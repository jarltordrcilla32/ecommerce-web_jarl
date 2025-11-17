function Testimonials() {
  const items = [
    { name: 'Ana', text: 'Our garden thrived with their soil conditioner!' },
    { name: 'Ramon', text: 'Proud to support a barangay-led circular project.' },
  ]
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold">What neighbors say</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {items.map(t => (
            <div key={t.name} className="rounded-xl bg-white shadow-sm p-6 border border-gray-100">
              <p className="text-gray-700">"{t.text}"</p>
              <div className="mt-3 text-sm text-gray-500">— {t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
