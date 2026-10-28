// Fallback food images mapped by cuisine and dish keywords
export const getDefaultFoodImage = (category = "", name = "") => {
  const text = `${category} ${name}`.toLowerCase();
  if (text.includes("biryani") || text.includes("dum") || text.includes("rice") || text.includes("pulao")) {
    return "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("pizza") || text.includes("margherita")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("burger") || text.includes("sandwich")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("chicken") || text.includes("mutton") || text.includes("meat") || text.includes("fish")) {
    return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("paneer") || text.includes("veg") || text.includes("dal") || text.includes("curry")) {
    return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("dessert") || text.includes("sweet") || text.includes("cake") || text.includes("ice cream") || text.includes("meetha")) {
    return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("chinese") || text.includes("noodle") || text.includes("manchurian") || text.includes("fried rice")) {
    return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("naan") || text.includes("roti") || text.includes("bread") || text.includes("paratha")) {
    return "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("salad") || text.includes("healthy")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("coffee") || text.includes("tea") || text.includes("shake") || text.includes("beverage")) {
    return "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80";
  }
  if (text.includes("thali") || text.includes("meal")) {
    return "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
};

// Fallback restaurant cover images mapped by cuisine
export const getDefaultRestaurantImage = (name = "", cuisine = "") => {
  const text = `${name} ${cuisine}`.toLowerCase();
  if (text.includes("pizza") || text.includes("italian")) {
    return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("biryani") || text.includes("spice") || text.includes("hyderabadi") || text.includes("palace") || text.includes("tandoor")) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("burger") || text.includes("fast food") || text.includes("cafe")) {
    return "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("chinese") || text.includes("asian") || text.includes("wok")) {
    return "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80";
  }
  if (text.includes("sweet") || text.includes("bakery") || text.includes("dessert")) {
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80";
};

export const getMediaUrl = (
  path,
  apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api",
  fallbackType = "food",
  name = "",
  category = ""
) => {
  if (!path) {
    return fallbackType === "restaurant"
      ? getDefaultRestaurantImage(name, category)
      : getDefaultFoodImage(category, name);
  }

  const value = String(path).trim();
  if (!value) {
    return fallbackType === "restaurant"
      ? getDefaultRestaurantImage(name, category)
      : getDefaultFoodImage(category, name);
  }

  if (value.startsWith("data:image") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const baseUrl = apiBase.replace(/\/api\/?$/, "");

  if (value.startsWith("/uploads/")) {
    return `${baseUrl}${value}`;
  }

  if (value.startsWith("/")) {
    return `${baseUrl}${value}`;
  }

  return `${baseUrl}/uploads/${value}`;
};

export const hideBrokenImage = (event, fallbackUrl) => {
  const target = event.currentTarget;
  // Prevent infinite loops if fallback also fails
  if (target.dataset.triedFallback === "true") {
    target.style.display = "none";
    return;
  }
  target.dataset.triedFallback = "true";
  target.src = fallbackUrl || getDefaultFoodImage();
};
