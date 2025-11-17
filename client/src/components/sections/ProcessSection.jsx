import { Link } from 'react-router-dom'

// Import images
import collectingFoodWasteImg from '../../assets/images/collecting-food-waste.png'
import compostingImg from '../../assets/images/composting.png'
import safetyImg from '../../assets/images/safety.png'
import processingFoodWasteImg from '../../assets/images/processing-food-waste.png'
import soilDistriImg from '../../assets/images/soil-distri.png'

function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Food Waste Collection",
      subtitle: "Community-Driven Collection",
      description: "Every weekend, households in our barangay separate their food waste and bring it to designated collection points. Our community volunteers help sort and organize the materials for processing.",
      icon: "🗑️",
      image: collectingFoodWasteImg,
      stats: ["150+ households", "500kg+ monthly", "4 collection points"],
      color: "emerald",
      features: ["Weekend collection schedule", "Community volunteers", "Proper waste sorting", "Designated drop-off points"]
    },
    {
      step: "02", 
      title: "Processing & Composting",
      subtitle: "Natural Decomposition Process",
      description: "Collected waste is processed through our community composting facility with proper aeration, temperature monitoring, and organic additives to accelerate decomposition.",
      icon: "🌱",
      image: compostingImg,
      stats: ["60-day process", "Natural enzymes", "Quality control"],
      color: "green",
      features: ["Aerobic composting", "Temperature monitoring", "Natural additives", "Regular turning"]
    },
    {
      step: "03",
      title: "Quality Control",
      subtitle: "Safety & Nutrient Analysis",
      description: "Compost is tested for nutrient content, pH levels, and safety standards. We ensure it meets organic certification requirements before packaging.",
      icon: "✅",
      image: safetyImg,
      stats: ["Lab tested", "Organic certified", "pH balanced"],
      color: "blue",
      features: ["Nutrient analysis", "pH testing", "Safety standards", "Organic certification"]
    },
    {
      step: "04",
      title: "Product Distribution",
      subtitle: "Ready for Your Garden",
      description: "Ready soil conditioner is packaged in eco-friendly containers and distributed through our platform. Customers can pick up locally or arrange delivery.",
      icon: "📦",
      image: soilDistriImg,
      stats: ["Eco packaging", "Local pickup", "Community delivery"],
      color: "purple",
      features: ["Eco-friendly packaging", "Local pickup points", "Community delivery", "Quality guarantee"]
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Circular Economy Process
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            From Waste to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800"> Wealth</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how we transform household food waste into premium soil conditioner through our innovative community-driven process.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div key={step.step} className={`relative ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold shadow-lg">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                      <p className="text-lg text-emerald-600 font-medium">{step.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {step.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                        <div className="text-sm text-gray-600">{stat}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent"></div>
                  </div>
                </div>

                {/* Enhanced Image Section */}
                <div className="relative group">
                  {/* Main Image Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                    
                    
                    
                    {/* Step Number Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl px-4 py-2 shadow-lg">
                        <div className="text-sm font-bold">{step.step}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Floating Badge */}
                  <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl w-48 h-48">
                    <div className="relative h-full">
                      {/* Subtle Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-full"></div>
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg mb-3 transform transition-transform duration-300 group-hover:scale-110">
                          <div className="text-xl">{step.icon}</div>
                        </div>
                        
                        {/* Process Info */}
                        <div className="space-y-2 flex-1">
                          <div className="text-sm font-bold text-gray-900 leading-tight">Process {step.step}</div>
                          <div className="text-xs text-emerald-600 font-medium min-h-[2.5rem] flex items-center">
                            {step.step === "01" && "Weekly Community Gathering"}
                            {step.step === "02" && "Organic Transformation"}
                            {step.step === "03" && "Premium Standards Check"}
                            {step.step === "04" && "Sustainable Delivery"}
                          </div>
                          
                          {/* Key Metric */}
                          <div className="mt-auto pt-3 border-t border-gray-100/50">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-semibold text-gray-700">{step.stats[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full opacity-20 blur-xl"></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-lg"></div>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 top-full w-px h-16 bg-gradient-to-b from-emerald-200 to-transparent transform -translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-32 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Our Impact Numbers</h3>
            <p className="text-emerald-100 text-lg">Real results from our community-driven circular economy</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 p-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500kg+</div>
              <div className="text-gray-600">Food waste diverted monthly</div>
              <div className="text-sm text-emerald-500 mt-1">From landfill</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">150+</div>
              <div className="text-gray-600">Households participating</div>
              <div className="text-sm text-emerald-500 mt-1">Active members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">₱25K+</div>
              <div className="text-gray-600">Community revenue generated</div>
              <div className="text-sm text-emerald-500 mt-1">Monthly income</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">4.9★</div>
              <div className="text-gray-600">Customer satisfaction</div>
              <div className="text-sm text-emerald-500 mt-1">Community rating</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-12 border border-emerald-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Circular Economy</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of the solution. Start contributing your food waste and help us create a sustainable future for our barangay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products/soil" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Shop Soil Conditioner
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="/impact" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold text-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
              >
                See Our Impact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
