import './App.css'
import Home from './home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductDetail from './components/ProductDetail'
import LoginPage from './components/LoginPage'
import Register_Page from './components/Register_Page'
import CartPage from './components/CartPage'
function App() {

  return (
    <>
<BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search/:query" element={< Home />} />
        <Route path="/register" element={< Register_Page />} />
        <Route path="/cart" element={< CartPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
  
}

export default App
