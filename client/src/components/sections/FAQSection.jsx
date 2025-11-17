import { useState } from 'react'

function FAQSection() {
  const faqs = [
    {
      question: "How does the food waste collection work?",
      answer: "Every weekend, households in our barangay separate their food waste and bring it to designated collection points. Our community volunteers help sort and organize the materials for processing. We have 4 collection points available for your convenience."
    },
    {
      question: "What sizes of soil conditioner are available?",
      answer: "We offer soil conditioner in three convenient sizes: 1kg pouch (₱25) for small gardens, 5kg pack (₱100) for medium gardens, and 25kg sack (₱500) for large projects. All sizes are made from the same high-quality compost."
    },
    {
      question: "How long does the composting process take?",
      answer: "Our composting process takes approximately 60 days from collection to finished product. We use natural enzymes and proper aeration to ensure quality while maintaining our community standards."
    },
    {
      question: "Is the soil conditioner organic and safe?",
      answer: "Yes! Our soil conditioner is lab-tested, organic certified, and pH balanced. We ensure it meets all safety standards before packaging. It's perfect for gardens, farms, and landscaping projects."
    },
    {
      question: "How can I pick up my order?",
      answer: "We offer local pickup at our community facility. Once your order is ready, you'll receive a notification with pickup details. We also offer community delivery for larger orders. All packaging is eco-friendly and plastic-free."
    },
    {
      question: "How does this benefit our community?",
      answer: "Our circular economy creates local jobs, generates community revenue (₱25K+ monthly), and reduces landfill waste by 500kg+ monthly. We've engaged 150+ households and created 15+ local jobs while building environmental awareness."
    }
  ]

  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800"> Know</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get answers to common questions about our circular economy process and products.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <svg 
                  className={`h-6 w-6 text-gray-500 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-3xl p-12 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Our community team is here to help. Reach out to us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Us
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold text-lg hover:bg-emerald-50 transition-all duration-300">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
