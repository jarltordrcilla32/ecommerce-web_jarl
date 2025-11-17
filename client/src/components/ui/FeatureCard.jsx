function FeatureCard({ title, text, icon }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-medium">{title}</div>
      <div className="text-gray-600 text-sm">{text}</div>
    </div>
  )
}

export default FeatureCard
