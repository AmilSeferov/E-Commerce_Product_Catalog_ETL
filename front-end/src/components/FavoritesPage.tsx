import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar.tsx";
import ProductCard from "../components/ProductCard.tsx";
import { Heart, Sparkles } from "lucide-react";

interface ProductType {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  discountPercentage?: number;
}

const Favorites: React.FC = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [favorites, setFavorites] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      alert("Favoritlərə baxmaq üçün əvvəlcə daxil olun!");
      navigate("/login");
      return;
    }

    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await axios.get(
        `http://localhost:2000/favorites/${user.id}`
      );

      setFavorites(res.data.favorites || []);
      setLoading(false);
    } catch (error) {
      console.error("Favoritlər yüklənmədi:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Navbar onSearch={() => {}} />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar showBack={true} onSearch={() => {}} />

      <div className="max-w-7xl mx-auto px-4 mt-10">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="text-white fill-white" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Bəyəndiklərim
            </h1>
            <p className="text-gray-600">
              {favorites.length} məhsul
            </p>
          </div>
        </div>

        {favorites.length === 0 ? (
          
          /* EMPTY FAVORITES */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Heart className="text-red-400" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Heç bir favori məhsul yoxdur
            </h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Bəyəndiyiniz məhsulları buraya əlavə edin və sonra asanlıqla tapa biləsiniz!
            </p>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Sparkles size={20} />
              <span>Məhsullara bax</span>
            </button>
          </div>
        ) : (
          
          /* FAVORITES GRID */
          <>
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
              <p className="text-center text-gray-700">
                <Heart className="inline text-red-500 fill-red-500 mb-1" size={18} />
                {" "}Sevimli məhsullarınızı bir yerdə saxlayın
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16">
              {favorites.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  thumbnail={p.thumbnail}
                  rating={p.rating}
                  discountPercentage={p.discountPercentage}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;