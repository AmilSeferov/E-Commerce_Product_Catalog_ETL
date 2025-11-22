

export default function filter() {
  return (
  <div className="flex justify-center gap-4 flex-wrap p-6 bg-white shadow-inner">
  {["All", "Clothes", "Accessories", "Home", "Eco"].map((cat) => (
    <button
      key={cat}
      className="px-5 py-2 rounded-full border border-green-400 text-green-700 hover:bg-green-400 hover:text-white transition"
    >
      {cat}
    </button>
  ))}
</div>
  )
}
