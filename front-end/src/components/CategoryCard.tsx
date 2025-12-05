import React, { useState } from "react";
import { X, Check } from "lucide-react";


interface Props {
  name: string;
  id: number;
  select_id: number | null;
  onSelect: (id: number) => void;
  onClear: () => void;
}

const CategoryCard: React.FC<Props> = ({ name, id, select_id, onSelect, onClear }) => {
  const isSelected = select_id === id;
  const [isHovered, setIsHovered] = useState(false);

  // Kateqoriyalara görə fərqli gradientlər
  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-purple-500 to-pink-400',
    'from-green-500 to-emerald-400',
    'from-rose-500 to-orange-400',
    'from-indigo-500 to-purple-400',
    'from-yellow-500 to-amber-400',
    'from-teal-500 to-green-400',
    'from-red-500 to-pink-400',
  ];

  const gradient = gradients[id % gradients.length];

  // Kateqoriya ikonları
  const icons: { [key: string]: string } = {
    'elektronika': '⚡',
    'geyim': '👕',
    'ev': '🏡',
    'kosmetika': '💄',
    'idman': '⚽',
    'usaq': '🧸',
    'kitab': '📚',
    'aksesuar': '👜',
  };

  const getIcon = () => {
    const key = name.toLowerCase().split(' ')[0];
    return icons[key] || '📦';
  };

  return (
    <button
      onClick={() => onSelect(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 transform ${
        isSelected 
          ? 'ring-4 ring-emerald-400 shadow-2xl scale-105' 
          : 'hover:shadow-xl hover:scale-105'
      }`}
    >
      
      {/* GRADIENT BACKGROUND */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} ${
        isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
      } transition-opacity`}></div>

      {/* PATTERN OVERLAY */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      {/* CONTENT */}
      <div className="relative z-10 text-center space-y-3">
        
      

        {/* NAME */}
        <p className="text-white font-bold text-base drop-shadow-lg">
          {name}
        </p>
      </div>

      {/* SELECTED CHECKMARK */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Check className="text-emerald-600" size={16} strokeWidth={3} />
        </div>
      )}

      {/* CLEAR BUTTON (X) - Yalnız seçilmiş category üçün */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute top-3 left-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-20"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}

      {/* SHIMMER EFFECT */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
        isHovered ? 'translate-x-full' : '-translate-x-full'
      } transition-transform duration-1000`}></div>
    </button>
  );
};

export default CategoryCard;