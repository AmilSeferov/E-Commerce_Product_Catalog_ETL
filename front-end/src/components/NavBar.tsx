import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut } from "lucide-react";

interface NavbarProps {
  onSearch: (query: string) => void;
  showBack?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, showBack = false }) => {
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [favCount, setFavCount] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavCount(fav.length);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate("/");
      onSearch(search);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const goFavorites = () => {
    if (!user) {
      alert("Favoritləri görmək üçün əvvəlcə daxil olun!");
      navigate("/login");
      return;
    }
    navigate("/favorites");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* LOGO */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                S
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ShahStore
              </h1>
              <p className="text-xs text-gray-500">Premium Quality</p>
            </div>
          </div>

          {/* SEARCH BAR - Desktop */}
          <form 
            onSubmit={handleSubmit}
            className="hidden md:flex flex-1 max-w-2xl"
          >
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition" size={20} />
              <input
                type="text"
                placeholder="Məhsul, brend və ya kateqoriya axtar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none text-gray-700"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                Axtar
              </button>
            </div>
          </form>

          {/* ICONS */}
          <div className="flex items-center gap-3">
            
            {/* BACK BUTTON */}
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-emerald-500 transition-all font-medium"
              >
                <span>←</span>
                <span>Geri</span>
              </button>
            )}

            {/* FAVORITES */}
            <button 
              onClick={goFavorites}
              className="relative hidden md:flex items-center justify-center w-11 h-11 rounded-xl hover:bg-red-50 transition-all group"
            >
              <Heart className="text-gray-600 group-hover:text-red-500 transition" size={22} />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {favCount}
                </span>
              )}
            </button>

            {/* CART */}
            <button 
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center w-11 h-11 rounded-xl hover:bg-emerald-50 transition-all group"
            >
              <ShoppingCart className="text-gray-600 group-hover:text-emerald-600 transition" size={22} />
              {Number(localStorage.getItem("cartCount")) > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {localStorage.getItem("cartCount")}
                </span>
              )}
            </button>

            {/* USER / LOGIN */}
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <User size={18} />
                <span>Daxil ol</span>
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-medium"
                >
                  <LogOut size={18} />
                  <span>Çıxış</span>
                </button>
              </div>
            )}

            {/* MOBILE MENU */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-100 transition-all"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <form onSubmit={handleSubmit} className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Məhsul axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition outline-none"
            />
          </div>
        </form>

        {/* MOBILE MENU DROPDOWN */}
        {menuOpen && (
          <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-2xl space-y-3 border border-gray-200">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-100 transition font-medium"
              >
                <span>←</span>
                <span>Geri</span>
              </button>
            )}
            
            <button 
              onClick={goFavorites}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:bg-red-50 transition font-medium"
            >
              <Heart size={20} />
              <span>Bəyəndiklərim</span>
              {favCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{favCount}</span>
              )}
            </button>

            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-md"
              >
                <User size={20} />
                <span>Daxil ol</span>
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition font-medium"
                >
                  <LogOut size={20} />
                  <span>Çıxış</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;