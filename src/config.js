export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  // Only prepend host if it's a local backend upload under /uploads/
  if (imagePath.startsWith("/uploads/") || imagePath.startsWith("uploads/")) {
    const rootUrl = API_BASE_URL.replace("/api", "");
    return `${rootUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  }
  // Return frontend public assets (like /professionals/alex.png) as-is
  return imagePath;
};
