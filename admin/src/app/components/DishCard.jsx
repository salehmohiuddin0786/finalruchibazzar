import { Edit2, Trash2, Star, Clock } from "lucide-react";

const DishCard = ({ dish }) => {
  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow">
            <span className="font-bold text-gray-800">₹{dish.price}</span>
          </div>
        </div>
        
        {/* Availability Badge */}
        {!dish.availability && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-gray-800 text-lg truncate">{dish.name}</h3>
          {dish.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{dish.description}</p>
          )}
        </div>

        {/* Quick Info */}
        <div className="flex items-center justify-between mb-4">
          {dish.rating && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-gray-700">{dish.rating}</span>
            </div>
          )}
          
          {dish.prepTime && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              {dish.prepTime}
            </div>
          )}
          
          {dish.category && (
            <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {dish.category}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
            <Edit2 size={16} />
            Edit
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;