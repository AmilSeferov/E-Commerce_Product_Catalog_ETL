import './App.css'
import Nav from './components/nav'
import Hero from './components/hero'
import Filter from './components/filter'
import Product from './components/product'
import Footer from './components/footer'
function App() {

  return (
    <>
<div className="min-h-screen bg-green-50 font-sans space-y-10">
  <Nav/>
  <Hero/>
  <Filter/>
  <Product/>
  <Footer/> 
</div>
    </>
  )
  
}

export default App
