import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./NavBar.tsx";
import ProductCard from "./ProductCard.tsx";

interface ProductDetailType {
  id: number;
  title: string;
  price: number;
  description: string;
  rating: number;
  brand: string;
  thumbnail: string;
  category_id: number;
  images: { image_url: string }[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  } | null;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [related, setRelated] = useState<ProductDetailType[]>([]);
  const navigate = useNavigate();
  // 1) Fetch main product
  useEffect(() => {
    axios.get(`http://localhost:2000/product/${id}`).then((res) => {
      setProduct(res.data);

      // 2) Fetch related products from the same category
      axios
        .get(
          `http://localhost:2000/products/category/${res.data.category_id}?limit=12&offset=0`
        )
        .then((relatedRes) => {
          const filtered = relatedRes.data.data.filter((p: any) => p.id !== res.data.id);
          setRelated(filtered);
        });
    });
  }, [id]);

  if (!product) {
    return (
      <div>
        <Navbar onSearch={() => {}} />
        <p className="text-center mt-10 text-green-700">Yüklənir...</p>
      </div>
    );
  }
const addToCart = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    alert("Səbətə əlavə etmək üçün daxil olmalısınız!");
    navigate("/login");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existing = cart.find((item: any) => item.id === product?.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product?.id,
      title: product?.title,
      price: product?.price,
      thumbnail: product?.thumbnail,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.length.toString());

  alert("Məhsul səbətə əlavə edildi!");
};

  return (
    <div className="min-h-screen bg-green-50">
      {/* NAVBAR ALWAYS VISIBLE */}
      <Navbar showBack={true} onSearch={() => {}} />

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="flex flex-col md:flex-row gap-10">

          {/* LEFT IMAGES */}
          <div className="md:w-1/2">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-80 object-cover rounded-lg shadow"
            />

            <div className="grid grid-cols-3 gap-3 mt-4">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  alt={`${product.title} image ${index + 1}`}
                  src={img.image_url}
                  className="h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          {/* RIGHT INFO */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-green-700">
              {product.title}
            </h1>

            <p className="text-gray-700 mt-2">{product.description}</p>

            <p className="text-2xl font-bold text-green-600 mt-3">
              ${product.price}
            </p>

            <p className="text-gray-600 text-sm mt-1">⭐ {(Math.round((product.rating)*10)/10)}</p>
            <p className="text-gray-600 text-sm">Brand: {product.brand}</p>

          

            <button onClick={addToCart} className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow">
              Səbətə əlavə et
            </button>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-green-700 mb-5">
            Oxşar məhsullar
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                price={p.price}
                thumbnail={p.thumbnail}
                rating={p.rating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
