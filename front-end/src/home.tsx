import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "./components/CategoryCard.tsx";
import ProductCard from "./components/ProductCard.tsx";
import Navbar from "./components/NavBar.tsx";

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

    axios.get(`http://localhost:2000/search?q=${query}`).then((res) => {
      setProducts(res.data.results);
    });
  };

  // CATEGORY CHANGE — FIXED 🔥
  const handleCategorySelect = (categoryId: number) => {
    setSearchActive(false);
    setSelectedCategory(categoryId);
    setProducts([]); // temizle
    setOffset(0); // sıfırla
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

  // default məhsulları yüklə
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
      if (searchActive) return; // Search zamanı infinite scroll OFF
      if (selectedCategory ) return; // Kateqoriya seçilib amma məhsul yoxdursa, yükləməni dayandır
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
    <div className="min-h-screen bg-green-50">
      <Navbar onSearch={handleSearch} />

      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white py-16 text-center shadow-md">
        <h1 className="text-4xl font-bold">ShahShop E-Commerce</h1>
      </div>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <h2 className="text-2xl text-green-700 font-bold mb-4">Kateqoriyalar</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-2xl text-green-700 font-bold mb-4">Məhsullar</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
