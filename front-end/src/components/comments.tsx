import React from 'react'

export default function comments() {
  return (
    <section className="bg-green-50 py-12 text-center">
  <h2 className="text-3xl font-bold text-green-800 mb-8">What Our Customers Say</h2>
  <div className="grid md:grid-cols-3 gap-6 px-8">
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="italic text-gray-600">"Amazing products and fast delivery!"</p>
      <h3 className="mt-4 font-semibold text-green-700">- Leyla R.</h3>
    </div>
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="italic text-gray-600">"Love the eco-friendly concept!"</p>
      <h3 className="mt-4 font-semibold text-green-700">- Murad S.</h3>
    </div>
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="italic text-gray-600">"High quality and beautiful packaging."</p>
      <h3 className="mt-4 font-semibold text-green-700">- Nigar A.</h3>
    </div>
  </div>
</section>
  )
}
