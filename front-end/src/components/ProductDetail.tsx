import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./NavBar.tsx";
import ProductCard from "./ProductCard.tsx";
import { Star, ShoppingCart, Heart, Package, Truck, Shield, TrendingUp } from "lucide-react";

interface ProductDetailType {
  id: number;
  title: string;
  price: number;
  description: string;
  rating: number;
  brand: string;
  thumbnail: string;
  discountPercentage?: number;
  category_id: number;
  images: { image_url: string }[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [related, setRelated] = useState<ProductDetailType[]>([]);
  const [activeIMG, setActiveIMG] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:2000/product/${id}`).then((res) => {
      setProduct(res.data);
      setActiveIMG(res.data.thumbnail);

      axios
        .get(`http://localhost:2000/products/category/${res.data.category_id}?limit=12&offset=0`)
        .then((relatedRes) => {
          const filtered = relatedRes.data.data.filter((p: any) => p.id !== res.data.id);
          setRelated(filtered);
        });
    });
  }, [id]);

  if (!product) {
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

  const numericPrice = Number(product.price);
  const hasDiscount = Number(product.discountPercentage) > 10;

  const newPrice = hasDiscount
    ? (numericPrice - numericPrice * (Number(product.discountPercentage) / 100)).toFixed(2)
    : numericPrice.toFixed(2);

  const addToCart = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Səbətə əlavə etmək üçün login olun!");
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: any) => i.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: quantity,
        discountPercentage: product.discountPercentage,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartCount", cart.length.toString());
    alert(`✅ ${quantity} ədəd məhsul səbətə əlavə edildi!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar showBack={true} onSearch={() => {}} />

      <div className="max-w-7xl mx-auto mt-10 px-4">
        
        {/* PRODUCT DETAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl p-8">
          
          {/* LEFT - IMAGES */}
          <div className="space-y-4">
            {/* DISCOUNT BADGE */}
            {hasDiscount && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg">
                <TrendingUp size={18} />
                <span>-{product.discountPercentage}% ENDİRİM</span>
              </div>
            )}

            {/* MAIN IMAGE */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
              <img
                src={activeIMG}
                alt={product.title}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* THUMBNAIL IMAGES */}
            <div className="grid grid-cols-4 gap-3">
              <div
                onClick={() => setActiveIMG(product.thumbnail)}
                onMouseEnter={() => setActiveIMG(product.thumbnail)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition ${
                  activeIMG === product.thumbnail
                    ? "border-emerald-500 shadow-lg"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <img
                  src={product.thumbnail}
                  alt=""
                  className="w-full h-24 object-cover"
                />
              </div>
              {product.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIMG(img.image_url)}
                  onMouseEnter={() => setActiveIMG(img.image_url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition ${
                    activeIMG === img.image_url
                      ? "border-emerald-500 shadow-lg"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt=""
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - INFO */}
          <div className="space-y-6">
            
            {/* TITLE */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {product.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* RATING & BRAND */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl">
                <Star className="fill-yellow-400 text-yellow-400" size={20} />
                <span className="font-bold text-gray-800">{Number(product.rating).toFixed(1)}</span>
                <span className="text-sm text-gray-600">(245 rəy)</span>
              </div>

              <div className="px-4 py-2 bg-gray-100 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-600">Brand:</span>
                <span className="ml-2 font-bold text-gray-800">{product.brand}</span>
              </div>
            </div>

            {/* PRICE */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                {hasDiscount ? (
                  <>
                    <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${newPrice}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xl text-gray-500 line-through">
                        ${numericPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        ${(numericPrice - Number(newPrice)).toFixed(2)} qənaət
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ${numericPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Miqdar:</span>
              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 font-bold text-xl transition"
                >
                  -
                </button>
                <span className="px-6 font-bold text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 font-bold text-xl transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={addToCart}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <ShoppingCart size={22} />
                <span>Səbətə əlavə et</span>
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-6 py-4 rounded-xl border-2 transition-all ${
                  isFavorite
                    ? "bg-red-50 border-red-500 text-red-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-red-300"
                }`}
              >
                <Heart
                  className={isFavorite ? "fill-red-500" : ""}
                  size={24}
                />
              </button>
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Truck className="text-blue-600" size={28} />
                <span className="text-sm font-semibold text-gray-700">Pulsuz Çatdırılma</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl border border-green-200">
                <Shield className="text-green-600" size={28} />
                <span className="text-sm font-semibold text-gray-700">Zəmanət</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <Package className="text-purple-600" size={28} />
                <span className="text-sm font-semibold text-gray-700">Sürətli Göndərmə</span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-20 pb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Oxşar Məhsullar
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  rating={p.rating}
                  thumbnail={p.thumbnail}
                  discountPercentage={p.discountPercentage}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;