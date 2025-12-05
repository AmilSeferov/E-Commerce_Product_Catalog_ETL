import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar.tsx";
import ProductCard from "../components/ProductCard.tsx";
import { Search, AlertCircle, Sparkles } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    if (!query.trim()) {
      navigate("/");
      return;
    }

    setLoading(true);

    axios.get(`http://localhost:2000/search?q=${query}`).then((res) => {
      setProducts(res.data.results);
      setLoading(false);
    });
  }, [query]);

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    navigate(`/search?q=${value}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar onSearch={handleSearch} showBack={true} />

      <div className="max-w-7xl mx-auto px-4 mt-10">
        
        {/* SEARCH HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Search className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Axtarış Nəticələri
              </h1>
              <p className="text-gray-600 text-lg">
                "<span className="font-semibold text-emerald-600">{query}</span>" üzrə
              </p>
            </div>
          </div>

          {!loading && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <Sparkles className="text-emerald-600" size={16} />
              <span className="text-emerald-700 font-medium">
                {products.length} məhsul tapıldı
              </span>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="text-emerald-600 animate-pulse" size={32} />
              </div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">Axtarılır...</p>
            <p className="text-sm text-gray-500">Ən yaxşı nəticələri tapırıq</p>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <AlertCircle className="text-red-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Heç bir məhsul tapılmadı
            </h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
              "<span className="font-semibold text-red-600">{query}</span>" üzrə heç bir nəticə yoxdur. 
              Başqa bir açar söz cəhd edin.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Ana Səhifəyə Qayıt
            </button>
          </div>
        )}

        {/* RESULTS */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;