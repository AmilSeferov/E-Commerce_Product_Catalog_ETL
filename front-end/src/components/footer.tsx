export default function footer() {
  return (
    <footer className="bg-green-800 text-white py-10">
  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
    
    {/* Logo və qısa məlumat */}
    <div className="text-center md:text-left">
      <h2 className="text-2xl font-bold mb-2">🛍️ ShahShop</h2>
      <p className="text-green-100 max-w-sm">
        Your trusted eco-friendly marketplace. Quality, sustainability, and style — all in one place.
      </p>

      {/* Telefon nömrəsi */}
      <div className="mt-4 flex items-center justify-center md:justify-start space-x-2 text-green-100">
        <span className="text-xl">📞</span>
        <a
          href="tel:+994501234567"
          className="hover:text-green-300 transition"
        >
          +994 50 123 45 67
        </a>
      </div>
    </div>

    {/* Sosial media linkləri */}
    <div className="flex justify-center md:justify-end space-x-8 text-3xl">
      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-110 transition-transform"
        title="GitHub"
      >
        <i className="fa-brands fa-github"></i>
      </a>

      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-110 transition-transform"
        title="Instagram"
      >
        <i className="fa-brands fa-instagram"></i>
      </a>

      <a
        href="https://www.linkedin.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-110 transition-transform"
        title="LinkedIn"
      >
        <i className="fa-brands fa-linkedin"></i>
      </a>
    </div>
  </div>

  {/* Copyright */}
  <div className="mt-8 text-center text-green-200 border-t border-green-700 pt-4 text-sm">
    © {new Date().getFullYear()} ShahShop. All rights reserved.
  </div>
</footer>

  )
}
