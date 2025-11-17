import Container from '../components/layout/Container'
import Hero from '../components/sections/Hero'
import ProcessSection from '../components/sections/ProcessSection'
import CommunityImpact from '../components/sections/CommunityImpact'
import FeaturesSection from '../components/sections/FeaturesSection'
import Impact from '../components/sections/Impact'
import FAQSection from '../components/sections/FAQSection'
import Testimonials from '../components/sections/Testimonials'
import FeatureCard from '../components/ui/FeatureCard'
import ProductCardCompact from '../components/ui/ProductCardCompact'

// Import images
import soilConditionerImg from '../assets/images/soil-conditioner.png'
import hogSwillImg from '../assets/images/hog-swill.png'

function HomePage() {
  return (
    <Container>
      <Hero />
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <FeatureCard 
                title="Free Pickup Service" 
                text="Convenient drop-off points every weekend with our community collection system." 
                icon="🚚" 
              />
              <FeatureCard 
                title="Quality Assured" 
                text="Community standards with transparent processing and regular quality testing." 
                icon="✅" 
              />
              <FeatureCard 
                title="Environmental Impact" 
                text="Every purchase directly contributes to waste reduction and community sustainability." 
                icon="🌱" 
              />
        </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Products</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <ProductCardCompact 
                  slug="soil" 
                  title="Premium Soil Conditioner" 
                  price={199} 
                  badge="Best Seller"
                  image={soilConditionerImg} 
                />
                <ProductCardCompact 
                  slug="hogs" 
                  title="Sustainably Raised Hogs" 
                  price={5500} 
                  badge="Limited"
                  image={hogSwillImg} 
                />
              </div>
          </div>
        </div>
      </section>
        <ProcessSection />
        <CommunityImpact />
        <FeaturesSection />
      <Impact />
        <FAQSection />
      <Testimonials />
    </Container>
  )
}

export default HomePage
