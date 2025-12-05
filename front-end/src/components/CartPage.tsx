import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Package, AlertCircle } from "lucide-react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  quantity: number;
  discountPercentage?: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    localStorage.setItem("cartCount", newCart.length.toString());
  };

  const increase = (id: number) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decrease = (id: number) => {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newCart);
  };

  const remove = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const order = (data: any) => {
    navigate("/");
    data.map((item: any) => remove(item.id));
    alert("✅ Sifarişiniz uğurla qəbul edildi!");
  };

  const total = cart.reduce((acc, item) => {
    const basePrice = Number(item.originalPrice || item.price);
    const hasDiscount = Number(item.discountPercentage) > 10;

    const finalPrice = hasDiscount
      ? basePrice - basePrice * (Number(item.discountPercentage) / 100)
      : basePrice;

    return acc + finalPrice * item.quantity;
  }, 0);

  const totalDiscount = cart.reduce((acc, item) => {
    const basePrice = Number(item.originalPrice || item.price);
    const hasDiscount = Number(item.discountPercentage) > 10;

    if (hasDiscount) {
      const discount = basePrice * (Number(item.discountPercentage) / 100);
      return acc + discount * item.quantity;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar showBack={true} onSearch={() => {}} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingCart className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Səbətim
            </h1>
            <p className="text-gray-600">
              {cart.length} məhsul
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          
          /* EMPTY CART */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <ShoppingCart className="text-gray-400" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Səbətiniz boşdur
            </h2>
            <p className="text-gray-600 mb-6">
              Məhsul əlavə edin və alış-verişə başlayın!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Alış-verişə başla
            </button>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const basePrice = Number(item.originalPrice || item.price);
                const hasDiscount = Number(item.discountPercentage) > 10;

                const discountedPrice = hasDiscount
                  ? (basePrice - basePrice * (Number(item.discountPercentage) / 100)).toFixed(2)
                  : basePrice.toFixed(2);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6"
                  >
                    <div className="flex gap-6">
                      
                      {/* IMAGE */}
                      <div className="relative">
                        <img
                          src={item.thumbnail}
                          className="w-32 h-32 object-cover rounded-xl border-2 border-gray-100"
                        />
                        {hasDiscount && (
                          <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-lg shadow-lg">
                            -{item.discountPercentage}%
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="flex-1 space-y-3">
                        <h3 className="font-bold text-lg text-gray-800">
                          {item.title}
                        </h3>

                        {/* PRICE */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-emerald-600">
                            ${discountedPrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                              ${basePrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* QUANTITY CONTROLS */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => decrease(item.id)}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="px-4 font-bold text-lg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increase(item.id)}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                            >
                              <Plus size={18} />
                            </button>
                          </div>

                          <div className="flex-1 text-right">
                            <p className="text-sm text-gray-600">Məhsul toplamı:</p>
                            <p className="text-xl font-bold text-gray-800">
                              ${(Number(discountedPrice) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => remove(item.id)}
                        className="self-start p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 space-y-6">
                
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <Package className="text-emerald-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">
                    Sifariş Xülasəsi
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Məhsullar ({cart.length}):</span>
                    <span className="font-semibold">
                      ${(total + totalDiscount).toFixed(2)}
                    </span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Endirim:</span>
                      <span className="font-semibold">
                        -${totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Çatdırılma:</span>
                    <span className="font-semibold text-green-600">Pulsuz</span>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Toplam:
                    </span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {totalDiscount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-green-600 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Siz ${totalDiscount.toFixed(2)} qənaət etdiniz!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Endirimlər avtomatik tətbiq olundu
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => order(cart)}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <CreditCard size={22} />
                  <span>Sifarişi Tamamla</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>🔒</span>
                  <span>Təhlükəsiz ödəniş</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;