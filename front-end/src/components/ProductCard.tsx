import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";

interface ProductProps {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  discountPercentage?: number;
}

const ProductCard: React.FC<ProductProps> = ({
  id,
  title,
  price,
  thumbnail,
  rating,
  discountPercentage,
}) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [isFav, setIsFav] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:2000/favorites/check/${user.id}/${id}`)
      .then((res) => setIsFav(res.data.isFavorite))
      .catch(() => {});
  }, [id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert("Favoritlər üçün login olun!");
      navigate("/login");
      return;
    }

    try {
      if (isFav) {
        await axios.delete("http://localhost:2000/favorites/remove", {
          data: { user_id: user.id, product_id: id },
        });
        setIsFav(false);
      } else {
        await axios.post("http://localhost:2000/favorites/add", {
          user_id: user.id,
          product_id: id,
        });
        setIsFav(true);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      alert("Səbətə əlavə etmək üçün login olun!");
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => i.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, title, price, thumbnail, quantity: 1, discountPercentage });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartCount", cart.length.toString());
    alert("✅ Məhsul səbətə əlavə edildi!");
  };

  // DISCOUNT CALCULATION
  const numericPrice = Number(price);
  const hasDiscount = Number(discountPercentage) > 10;

  const newPrice = hasDiscount
    ? (numericPrice - numericPrice * (Number(discountPercentage) / 100)).toFixed(2)
    : numericPrice.toFixed(2);

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 transform ${
        isHovered ? '-translate-y-2' : ''
      } cursor-pointer overflow-hidden`}
    >
      
      {/* DISCOUNT BADGE */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg animate-pulse">
          -{discountPercentage}%
        </div>
      )}

      {/* FAVORITE BUTTON */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
      >
        <Heart
          className={`${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-400'} transition-all`}
          size={20}
        />
      </button>

      {/* IMAGE */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        
        {/* TITLE */}
        <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors h-12">
          {title}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1">
          <Star className="fill-yellow-400 text-yellow-400" size={16} />
          <span className="text-sm font-semibold text-gray-700">{Number(rating).toFixed(1)}</span>
          <span className="text-xs text-gray-400 ml-1">(128 rəy)</span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            ${newPrice}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${numericPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          onClick={addToCart}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          <span>Səbətə əlavə et</span>
        </button>
      </div>

      {/* HOVER SHINE EFFECT */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${
        isHovered ? 'animate-shine' : ''
      }`}></div>
    </div>
  );
};

export default ProductCard;