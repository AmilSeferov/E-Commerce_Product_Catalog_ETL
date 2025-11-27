interface Props {
  name: string;
  id: number;
  select_id: number | null;
  onSelect: (id: number) => void;
  onClear: () => void; // 🆕 X düyməsi üçün
}

const CategoryCard: React.FC<Props> = ({ name, id, select_id, onSelect, onClear }) => {
  const isSelected = select_id === id;

  return (
    <div
      onClick={() => onSelect(id)}
      className={`
        relative
        ${isSelected ? "border-green-700 bg-green-100" : "bg-green-50"}
        border border-green-300 p-4 rounded-lg shadow 
        hover:shadow-lg transition cursor-pointer text-center
      `}
    >
      {/* X BUTTON — Yalnız seçilmiş category üçün */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // klik kartı trigger etməsin
            onClear();           // seçimi sıfırlayırıq
          }}
          className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-green-600 text-xs"
        >
          x
        </button>
      )}

      <p className="font-semibold text-green-700">{name}</p>
    </div>
  );
};

export default CategoryCard;
