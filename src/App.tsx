import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import MenuSection from './components/MenuSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <ContactSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
