export const getMediaUrl = (path, apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api") => {
  if (!path) return "";

  const value = String(path).trim();

  if (value.startsWith("data:image")) {
    return value;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const baseUrl = apiBase.replace("/api", "");

  if (value.startsWith("/")) {
    return `${baseUrl}${value}`;
  }

  return `${baseUrl}/uploads/${value}`;
};

export const hideBrokenImage = (event) => {
  event.currentTarget.style.display = "none";
};
