
export default function nav() {
  return (
    
 <nav className="flex items-center justify-between bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-4 shadow-lg rounded-b-2xl">
  {/* Logo */}
  <div className="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
    🛍️ ShahShop
  </div>


  {/* Search Bar */}
  <div className="hidden md:flex items-center space-x-3 w-full max-w-md mx-6">
    <input
      type="text"
      placeholder="Search for products..."
      className="flex-grow rounded-full border border-green-200 bg-white/90 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white shadow-inner placeholder:text-green-700"
    />
    <button className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition duration-200 shadow">
      🔍
    </button>
  </div>

  {/* Icons */}
  <div className="flex items-center space-x-6 text-white text-2xl">
    <button className="hover:scale-110 transition-transform duration-200">
      🛒
    </button>
    <button className="hover:scale-110 transition-transform duration-200">
      👤
    </button>
    {/* Mobil üçün axtarış ikonu */}
    <button className="md:hidden hover:scale-110 transition-transform duration-200">
      🔍
    </button>
  </div>
</nav>
  )
}
