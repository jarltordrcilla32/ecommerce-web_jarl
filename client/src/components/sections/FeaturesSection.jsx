import { useState } from 'react'
import { Link } from 'react-router-dom'

// Import images
import collectingFoodWasteImg from '../../assets/images/collecting-food-waste.png'
import mainBuildingImg from '../../assets/images/main-building.png'
import soilDistriImg from '../../assets/images/soil-distri.png'
import processingFoodWasteImg from '../../assets/images/processing-food-waste.png'
import compostingImg from '../../assets/images/composting.png'
import safetyImg from '../../assets/images/safety.png'

function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  
  const features = [
    {
      title: "Circular Economy",
      subtitle: "Waste to Wealth",
      description: "Transform food waste into valuable products through our innovative community-driven process.",
      image: collectingFoodWasteImg,
      stats: ["500kg+ waste diverted", "150+ households", "Zero landfill"],
      color: "emerald"
    },
    {
      title: "Local Community",
      subtitle: "Barangay First",
      description: "Supporting local farmers and creating jobs while building a sustainable future for our barangay.",
      image: mainBuildingImg,
      stats: ["15+ local jobs", "₱25K+ revenue", "Community owned"],
      color: "blue"
    },
    {
      title: "Convenient Pickup",
      subtitle: "Weekend Collection",
      description: "Multiple collection points every weekend with our community volunteer system.",
      image: soilDistriImg,
      stats: ["4 collection points", "Weekend schedule", "Free pickup"],
      color: "orange"
    }
  ]

  return (
    <section id="features" className="py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f0fdf4%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Why Choose GreenConnect
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Building a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-800"> Sustainable Future</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our community-driven initiative that transforms waste into wealth while creating lasting positive impact.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Feature Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color === 'emerald' ? 'from-emerald-50 to-green-100' : feature.color === 'blue' ? 'from-blue-50 to-indigo-100' : 'from-orange-50 to-red-100'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with Gradient Background */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color === 'emerald' ? 'from-emerald-500 to-green-600' : feature.color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {index === 0 ? "🌱" : index === 1 ? "🏠" : "🚚"}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">{feature.description}</p>
                  
                  {/* Stats with Enhanced Design */}
                  <div className="space-y-3">
                    {feature.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 group-hover:bg-white/80 transition-colors duration-300">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color === 'emerald' ? 'from-emerald-500 to-green-600' : feature.color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'}`}></div>
                        <span className="text-sm font-medium text-gray-700">{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Image */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Feature Showcase - Inspired by Modern E-commerce */}
        <div className="relative mb-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl"></div>
          
          <div className="relative z-10 p-12 rounded-3xl border border-gray-200/50 backdrop-blur-sm">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GreenConnect?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the future of sustainable commerce with our innovative platform</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Quality Assurance - Apple-inspired Design */}
              <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Header Section */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">✅</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">4.9</div>
                        <div className="text-sm text-gray-500">★ Rating</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality Assured</h3>
                    <p className="text-gray-600 leading-relaxed">Premium organic products with community-verified standards and rigorous testing protocols.</p>
                  </div>
                  
                  {/* Stats Section */}
                  <div className="px-8 pb-8">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">100%</div>
                        <div className="text-sm text-gray-600">Lab Tested</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">ISO</div>
                        <div className="text-sm text-gray-600">Certified</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span>🏆</span>
                        <span>Certified Organic</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-600 font-bold text-sm border-2 border-emerald-100 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                    A+
                  </div>
                </div>
              </div>

              {/* Environmental Impact - Tesla-inspired Design */}
              <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Header Section */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">💚</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">60%</div>
                        <div className="text-sm text-gray-500">Reduction</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Environmental Impact</h3>
                    <p className="text-gray-600 leading-relaxed">Every purchase contributes to our mission of creating a sustainable, zero-waste future for our community.</p>
                  </div>
                  
                  {/* Impact Metrics */}
                  <div className="px-8 pb-8">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">🌱</div>
                          <div>
                            <div className="font-semibold text-gray-900">Methane Reduction</div>
                            <div className="text-sm text-gray-500">Greenhouse gas impact</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">60%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm">🌍</div>
                          <div>
                            <div className="font-semibold text-gray-900">Carbon Neutral</div>
                            <div className="text-sm text-gray-500">Net zero emissions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">✓</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span>🌿</span>
                        <span>Zero Waste Certified</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                    ♻️
                  </div>
                </div>
              </div>

              {/* Digital Platform - Shopify-inspired Design */}
              <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Header Section */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">📱</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-orange-600">24/7</div>
                        <div className="text-sm text-gray-500">Support</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Digital Platform</h3>
                    <p className="text-gray-600 leading-relaxed">Seamless e-commerce experience with cutting-edge technology and round-the-clock customer support.</p>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="px-8 pb-8">
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg">📱</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Mobile App</div>
                          <div className="text-sm text-gray-500">iOS & Android platforms</div>
                        </div>
                        <div className="text-orange-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg">⚡</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Real-time Updates</div>
                          <div className="text-sm text-gray-500">Live tracking & notifications</div>
                        </div>
                        <div className="text-orange-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg">🔒</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Secure Payments</div>
                          <div className="text-sm text-gray-500">SSL encrypted transactions</div>
                        </div>
                        <div className="text-orange-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span>🚀</span>
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-orange-600 font-bold text-sm border-2 border-orange-100 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                    ⚡
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-3xl p-12 text-white shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M20%2020c0%2011.046-8.954%2020-20%2020v-40c11.046%200%2020%208.954%2020%2020z%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h3>
              <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Start contributing to our circular economy today. Every small action creates a big impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/products/soil" 
                  className="group inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-emerald-700 font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Shop Products
                  <svg className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  to="/process" 
                  className="group inline-flex items-center justify-center px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Learn More
                  <svg className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
