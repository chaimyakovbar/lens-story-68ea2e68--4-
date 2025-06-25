// S3 Image URL mapping
// Replace 'levinstein-images' with your actual bucket name if different
const S3_BASE_URL = "https://levinstein-images.s3.eu-north-1.amazonaws.com";

export const getImageUrl = (localPath) => {
  // Remove leading slash if present
  const cleanPath = localPath.startsWith("/") ? localPath.slice(1) : localPath;

  // If it's already a full URL, return as is
  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  // Convert local path to S3 path
  // Remove 'src/assets/' prefix if present
  let s3Path = cleanPath;
  if (s3Path.startsWith("src/assets/")) {
    s3Path = s3Path.replace("src/assets/", "");
  }

  const finalUrl = `${S3_BASE_URL}/assets/${s3Path}`;

  return finalUrl;
};

// Common image URLs for easy access
export const imageUrls = {
  // Main images
  "JV1A2929.jpg": getImageUrl("JV1A2929.jpg"),
  "JV1A2930.jpg": getImageUrl("JV1A2930.jpg"),
  "JV1A2976.jpg": getImageUrl("JV1A2976.jpg"),
  "logoskitza.PNG": getImageUrl("logoskitza.PNG"),

  // Logo images
  "logoBlack.png": getImageUrl("logoBlack.png"),
  "logoWhite.png": getImageUrl("logoWhite.png"),

  // About page
  "images/face_about.jpg": getImageUrl("images/face_about.jpg"),

  // Home images
  "images/home/IMG-20250604-WA0026.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0026.jpg"
  ),
  "images/home/IMG-20250604-WA0027.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0027.jpg"
  ),
  "images/home/IMG-20250604-WA0028.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0028.jpg"
  ),
  "images/home/IMG-20250604-WA0029.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0029.jpg"
  ),
  "images/home/IMG-20250604-WA0030.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0030.jpg"
  ),
  "images/home/IMG-20250604-WA0031.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0031.jpg"
  ),
  "images/home/IMG-20250604-WA0032.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0032.jpg"
  ),
  "images/home/IMG-20250604-WA0033.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0033.jpg"
  ),
  "images/home/IMG-20250604-WA0035.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0035.jpg"
  ),
  "images/home/IMG-20250604-WA0036.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0036.jpg"
  ),
  "images/home/IMG-20250604-WA0037.jpg": getImageUrl(
    "images/home/IMG-20250604-WA0037.jpg"
  ),

  // Portfolio categories - you can add specific images as needed
  "bar-mitzvah/": getImageUrl("bar-mitzvah/"),
  "bat-mitzvah/": getImageUrl("bat-mitzvah/"),
  "business/": getImageUrl("business/"),
  "circumcision/": getImageUrl("circumcision/"),
  "designs/": getImageUrl("designs/"),
  "engagement/": getImageUrl("engagement/"),
  "haircut/": getImageUrl("haircut/"),
  "porpusal/": getImageUrl("porpusal/"),
  "tefilin/": getImageUrl("tefilin/"),
  "torah/": getImageUrl("torah/"),
  "wedding/": getImageUrl("wedding/"),
};

// Helper function to get a random image from a category
export const getRandomImageFromCategory = (category) => {
  // This is a simplified version - you might want to maintain a list of all images per category
  const categoryImages = {
    "bar-mitzvah": [
      "0J3A0027.jpg",
      "0J3A0076.jpg",
      "0J3A0142.jpg",
      "0J3A0177.jpg",
      "0J3A1134.jpg",
      "0J3A1260.jpg",
      "0J3A1271.jpg",
      "0J3A1570.jpg",
    ],
    wedding: [
      "0J3A0008.jpg",
      "0J3A3650.jpg",
      "0J3A3953.jpg",
      "0J3A4046.jpg",
      "0J3A4073.jpg",
      "0J3A5817.jpg",
      "0J3A5837.jpg",
      "0J3A5870.jpg",
    ],
    // Add more categories as needed
  };

  const images = categoryImages[category] || [];
  if (images.length === 0) return null;

  const randomImage = images[Math.floor(Math.random() * images.length)];
  return getImageUrl(`${category}/${randomImage}`);
};

// Export the base URL for custom usage
export { S3_BASE_URL };
