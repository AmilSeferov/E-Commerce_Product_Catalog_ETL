import React from "react";
import { useNavigate } from "react-router-dom";

interface ProductProps {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
}

const ProductCard: React.FC<ProductProps> = ({
  id, title, price, thumbnail, rating
}) => {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/product/${id}`);
  };

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kart klikini bloklayır → detala keçmir

    const user = localStorage.getItem("user");

    // 🔴 USER YOXDUR → LOGIN səhifəsinə göndər
    if (!user) {
      alert("Səbətə əlavə etmək üçün əvvəlcə daxil olun!");
      navigate("/login");
      return;
    }

    // 🟢 USER VAR → SƏBƏTƏ ƏLAVƏ ET
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item: any) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id,
        title,
        price,
        thumbnail,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartCount", cart.length.toString());

    alert("Məhsul səbətə əlavə edildi!");
  };

  return (
    <div
      onClick={goToDetail}
      className="border border-green-300 bg-white rounded-lg p-3 shadow hover:shadow-xl transition cursor-pointer"
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-40 object-cover rounded"
      />
      
      <h3 className="font-semibold mt-2 text-green-700 line-clamp-1">
        {title}
      </h3>

      <p className="text-green-600 font-bold">${price}</p>
      <p className="text-sm text-gray-600">⭐ {(Math.round((rating)*10)/10)}</p>

      <button
        className="w-full bg-green-600 hover:bg-green-700 text-white p-2 mt-2 rounded"
        onClick={addToCart}
      >
        Səbətə əlavə et
      </button>
    </div>
  );
};

export default ProductCard;
