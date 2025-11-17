function CommunityImpact() {
  const impacts = [
    {
      title: "Environmental Impact",
      description: "Reducing landfill waste and greenhouse gas emissions through proper food waste management.",
      icon: "🌍",
      stats: ["500kg waste diverted", "60% reduction in methane", "Cleaner barangay"]
    },
    {
      title: "Economic Benefits", 
      description: "Creating local jobs and generating income for community members through waste processing.",
      icon: "💰",
      stats: ["₱25K+ monthly revenue", "15 local jobs created", "Affordable products"]
    },
    {
      title: "Social Impact",
      description: "Building community cohesion and environmental awareness through collaborative efforts.",
      icon: "🤝",
      stats: ["150+ households", "Community workshops", "Youth engagement"]
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Community Impact & Recognition
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our circular economy model is transforming our barangay and creating lasting positive change.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">{impact.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{impact.title}</h3>
              <p className="text-gray-600 mb-6">{impact.description}</p>
              <ul className="space-y-2">
                {impact.stats.map((stat, statIndex) => (
                  <li key={statIndex} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    {stat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Recognition Grid */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Community Recognition</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold text-gray-900">Best Community Project</div>
              <div className="text-sm text-gray-600">Barangay Awards 2024</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-3xl mb-2">🌱</div>
              <div className="font-semibold text-gray-900">Environmental Excellence</div>
              <div className="text-sm text-gray-600">Green Philippines</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="text-3xl mb-2">💡</div>
              <div className="font-semibold text-gray-900">Innovation Award</div>
              <div className="text-sm text-gray-600">Social Enterprise</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-orange-50 border border-orange-100">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold text-gray-900">Community Choice</div>
              <div className="text-sm text-gray-600">4.9★ Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunityImpact
