// Utility to verify S3 images are loading correctly
import { imageUrls } from "./imageUrls";

export const verifyS3Images = () => {
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    errors: [],
  };

  Object.entries(imageUrls).forEach(([key, url]) => {
    results.total++;

    if (url && url.startsWith("https://levinstein-images.s3.amazonaws.com")) {
      results.valid++;
    } else {
      results.invalid++;
      const error = `❌ ${key}: Invalid URL - ${url}`;
      results.errors.push(error);
      console.error(error);
    }
  });

  if (results.errors.length > 0) {
    console.log("\n🚨 Errors found:");
    results.errors.forEach((error) => console.error(error));
  } else {
    console.log("\n🎉 All images are using S3 URLs!");
  }

  return results;
};

// Function to test image loading
export const testImageLoading = async () => {
  const testResults = [];

  for (const [key, url] of Object.entries(imageUrls)) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        testResults.push({ key, status: "success", url });
      } else {
        testResults.push({
          key,
          status: "error",
          url,
          error: `HTTP ${response.status}`,
        });
        console.error(`❌ ${key}: HTTP ${response.status}`);
      }
    } catch (error) {
      testResults.push({ key, status: "error", url, error: error.message });
      console.error(`❌ ${key}: ${error.message}`);
    }
  }

  const successCount = testResults.filter((r) => r.status === "success").length;

  return testResults;
};

// Export for use in development
if (process.env.NODE_ENV === "development") {
  window.verifyS3Images = verifyS3Images;
  window.testImageLoading = testImageLoading;
}
