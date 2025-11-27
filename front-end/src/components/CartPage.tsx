import React, { useEffect, useState } from "react";
import Navbar from "./NavBar";

interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

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
      .filter((item) => item.quantity > 0); // 0 olanda silinsin
    updateCart(newCart);
  };

  const remove = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar showBack={true} onSearch={() => {}} />
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Səbət</h1>

      {cart.length === 0 ? (
        <p className="text-green-700">Səbət boşdur.</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 items-center bg-white p-4 shadow rounded mb-4"
          >
            <img
              src={item.thumbnail}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-green-600 font-bold">${item.price}</p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  className="bg-green-500 text-white px-2 rounded"
                  onClick={() => decrease(item.id)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="bg-green-500 text-white px-2 rounded"
                  onClick={() => increase(item.id)}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => remove(item.id)}
            >
              Sil
            </button>
          </div>
        ))
      )}

      {/* TOTAL */}
      <div className="mt-6 text-xl font-bold text-green-700">
        Toplam: ${total.toFixed(2)}
      </div>
    </div>
    </div>
  );
};

export default CartPage;
