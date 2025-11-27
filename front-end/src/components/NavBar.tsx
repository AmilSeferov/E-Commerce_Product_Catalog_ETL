import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onSearch: (query: string) => void;
  showBack?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, showBack = false }) => {
  const [search, setSearch] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();

  // 🟢 Login olmuş user-i localStorage-dan alırıq
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🔍 Search button
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim() !== "") {
      navigate("/"); // 💚 Home Page-ə gedir
      onSearch(search); // 🔎 Axtarış işə düşür
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="w-full bg-green-700 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-3 py-1 rounded-md border border-white/60 text-sm hover:bg-white hover:text-green-700 transition"
          >
            <span>←</span>
            <span>Geri</span>
          </button>
        )}
        {/* LOGO */}
        <h1
          className="text-xl font-bold tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          ShahShop
        </h1>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full md:w-1/2 bg-white rounded overflow-hidden shadow"
        >
          <input
            type="text"
            placeholder="Məhsul axtarın..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 text-black outline-none"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2"
          >
            🔍
          </button>
        </form>

        {/* AUTH / ACCOUNT */}
        <div className="flex gap-6 font-medium">
          <span
            className="cursor-pointer relative hover:text-green-200 transition"
            onClick={() => navigate("/cart")}
          >
            🛒
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {localStorage.getItem("cartCount") || 0}
            </span>
          </span>
          {/* 🔴 USER YOXDURSA → Login və Register göstər */}
          {!user && (
            <>
              <a href="/login" className="hover:text-green-200 transition">
                Login
              </a>
            </>
          )}

          {/* 🟢 USER VARSA → Account + Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <span className="font-semibold cursor-pointer hover:text-green-200">
                👤 {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
