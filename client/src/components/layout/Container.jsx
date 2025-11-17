import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

function Container({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

export default Container
