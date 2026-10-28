import { Edit2, Trash2, Star, Clock } from "lucide-react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000").replace(/\/api\/?$/, "");

const getDefaultFoodImage = (category = "", name = "") => {
  const text = `${category} ${name}`.toLowerCase();
  if (text.includes("biryani") || text.includes("dum") || text.includes("rice")) {
    return "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("pizza")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("burger") || text.includes("sandwich")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("chicken") || text.includes("mutton") || text.includes("curry") || text.includes("meat")) {
    return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("paneer") || text.includes("veg") || text.includes("dal")) {
    return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("dessert") || text.includes("sweet") || text.includes("cake") || text.includes("ice cream")) {
    return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("chinese") || text.includes("noodle") || text.includes("manchurian")) {
    return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
};

const getMediaUrl = (path, name = "", category = "") => {
  if (!path) return getDefaultFoodImage(category, name);
  const val = String(path).trim();
  if (!val) return getDefaultFoodImage(category, name);
  if (/^(https?:|data:|blob:)/i.test(val)) return val;
  if (val.startsWith("/uploads/")) return `${API}${val}`;
  if (val.startsWith("/")) return `${API}${val}`;
  return `${API}/uploads/${val}`;
};

const DishCard = ({ dish }) => {
  const imageUrl = getMediaUrl(dish?.image, dish?.name, dish?.category);

  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={dish?.name || "Dish"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            if (e.currentTarget.dataset.fallback !== "true") {
              e.currentTarget.dataset.fallback = "true";
              e.currentTarget.src = getDefaultFoodImage(dish?.category, dish?.name);
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow">
            <span className="font-bold text-gray-800">₹{dish?.price}</span>
          </div>
        </div>
        
        {/* Availability Badge */}
        {!dish?.availability && (
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
          <h3 className="font-bold text-gray-800 text-lg truncate">{dish?.name}</h3>
          {dish?.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{dish?.description}</p>
          )}
        </div>

        {/* Quick Info */}
        <div className="flex items-center justify-between mb-4">
          {dish?.rating && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-gray-700">{dish?.rating}</span>
            </div>
          )}
          
          {dish?.prepTime && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              {dish?.prepTime}
            </div>
          )}
          
          {dish?.category && (
            <div className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {dish?.category}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
