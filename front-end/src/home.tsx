import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "./components/CategoryCard.tsx";
import ProductCard from "./components/ProductCard.tsx";
import Navbar from "./components/NavBar.tsx";
import { useNavigate } from "react-router";
import { TrendingUp, Zap, Package } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
}

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const navigate = useNavigate();
  const limit = 12;

  // CATEGORIES
  useEffect(() => {
    axios.get("http://localhost:2000/categories").then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

  // LOAD PRODUCTS (GLOBAL)
  const loadProducts = () => {
    if (searchActive) return;

    let url = `http://localhost:2000/products?limit=${limit}&offset=${offset}`;

    if (selectedCategory) {
      url = `http://localhost:2000/products?category_id=${selectedCategory}&limit=${limit}&offset=${offset}`;
    }

    axios.get(url).then((res) => {
      setProducts((prev) => [...prev, ...res.data.data]);
      setOffset(res.data.nextOffset);
    });
  };

  // FIRST LOAD
  useEffect(() => {
    loadProducts();
  }, []);

  // SEARCH
  const handleSearch = (query: string) => {
    setSearchActive(true);
    setProducts([]);
    setOffset(0);
    setSelectedCategory(null);

    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  const ScrollTo = () =>
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  // CATEGORY CHANGE
  const handleCategorySelect = (categoryId: number) => {
    setSearchActive(false);
    setSelectedCategory(categoryId);
    setProducts([]);
    setOffset(0);
    axios
      .get(
        `http://localhost:2000/products/category/${categoryId}?limit=${limit}&offset=0`
      )
      .then((res) => {
        setProducts(res.data.data);
        setOffset(res.data.nextOffset);
      });
  };

  // CLEAR CATEGORY SELECTION
  const clearCategory = () => {
    setSelectedCategory(null);
    setProducts([]);
    setOffset(0);

    axios
      .get(`http://localhost:2000/products?limit=${limit}&offset=0`)
      .then((res) => {
        setProducts(res.data.data);
        setOffset(res.data.nextOffset);
      });
  };

  // INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (searchActive) return;
      if (selectedCategory) return;
      const bottom =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 200;

      if (bottom) {
        loadProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset, selectedCategory, searchActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar onSearch={handleSearch} />

      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white space-y-6 flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                <TrendingUp size={16} />
                <span>Yeni Kolleksiya 2024</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Premium Məhsullar
                <br />
                <span className="text-yellow-300">Əla Qiymətlər</span>
              </h1>

              <p className="text-xl text-emerald-50 max-w-xl">
                50%-ə qədər endirimlər • Pulsuz çatdırılma • 24/7 dəstək
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2">
                  <Zap size={20} />
                  <span>İndi Al</span>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                  <Package size={20} />
                  <span>Daha Çox</span>
                </button>
              </div>
            </div>

            <div className="text-8xl md:text-9xl animate-bounce">
              🛍️
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Kateqoriyalar
          </h2>
          {selectedCategory && (
            <div className="text-sm text-gray-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              Filtr aktiv
            </div>
          )}
        </div>

        <div onClick={ScrollTo} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              id={cat.id}
              select_id={selectedCategory}
              name={cat.name}
              onSelect={handleCategorySelect}
              onClear={clearCategory}
            />
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto mt-16 px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 id="products" className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {selectedCategory ? "Seçilmiş Məhsullar" : "Ən Populyar Məhsullar"}
          </h2>
          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
            {products.length} məhsul
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>

        {/* LOADING INDICATOR */}
        {!searchActive && !selectedCategory && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium">
              <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
              <span>Daha çox məhsul yüklənir...</span>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center font-bold shadow-lg">
                  S
                </div>
                <span className="text-xl font-bold">ShahStore</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Premium keyfiyyət və əlverişli qiymətlər. Azərbaycanda №1 onlayn mağaza.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-emerald-400">Məlumat</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Haqqımızda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Çatdırılma
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Qaytarma Şərtləri
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Gizlilik Siyasəti
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-emerald-400">Kateqoriyalar</h4>
              <ul className="space-y-2 text-gray-400">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <a href="#" className="hover:text-white transition">
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-emerald-400">Əlaqə</h4>
              <ul className="space-y-3 text-gray-400">
                <li>📞 +994 12 345 67 89</li>
                <li>✉️ info@shahstore.az</li>
                <li>📍 Bakı, Azərbaycan</li>
                <li className="flex gap-3 pt-2">
                  <a
                    href="#"
                    className="w-9 h-9 bg-gray-700 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition"
                  >
                    f
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-gray-700 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition"
                  >
                    📷
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-gray-700 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition"
                  >
                    in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024{" "}
              <span className="text-emerald-400 font-semibold">ShahStore</span>.
              Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;