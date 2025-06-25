import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure AWS from environment variables
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "levinstein-images";
const ASSETS_PATH = path.join(
  __dirname,
  "../lens-story-68ea2e68--4-/src/assets"
);

// Image file extensions to upload
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".JPG",
  ".JPEG",
  ".PNG",
  ".GIF",
  ".WEBP",
];

// Function to check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
}

// Function to upload a single file
async function uploadFile(filePath, s3Key) {
  try {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: getContentType(path.extname(filePath)),
      // ACL removed - bucket has ACLs disabled
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error(`❌ Failed to upload ${s3Key}:`, error.message);
    return null;
  }
}

// Function to get content type based on file extension
function getContentType(extension) {
  const contentTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return contentTypes[extension.toLowerCase()] || "application/octet-stream";
}

// Function to recursively find all image files
function findImageFiles(dir, baseDir = dir) {
  let files = [];

  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        files = files.concat(findImageFiles(fullPath, baseDir));
      } else if (stat.isFile() && isImageFile(item)) {
        // Get relative path from base directory
        const relativePath = path.relative(baseDir, fullPath);
        files.push({
          localPath: fullPath,
          s3Key: `assets/${relativePath.replace(/\\/g, "/")}`, // Use forward slashes for S3
        });
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return files;
}

// Main function
async function uploadAllImages() {
  console.log("🚀 Starting image upload to S3...");
  console.log(`📁 Scanning directory: ${ASSETS_PATH}`);
  console.log(`🪣 Target bucket: ${BUCKET_NAME}`);
  console.log(`🌍 AWS Region: ${process.env.AWS_REGION || "us-east-1"}`);
  console.log("");
  console.log(
    "ℹ️  Note: Make sure your S3 bucket has a bucket policy for public read access"
  );
  console.log("   since ACLs are disabled. You can add this bucket policy:");
  console.log("");
  console.log(`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}`);
  console.log("");

  // Check if credentials are configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error("❌ AWS credentials not found in environment variables!");
    console.error("Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY");
    return;
  }

  // Find all image files
  const imageFiles = findImageFiles(ASSETS_PATH);

  if (imageFiles.length === 0) {
    console.log("❌ No image files found in the assets directory");
    return;
  }

  console.log(`📸 Found ${imageFiles.length} image files to upload:`);
  imageFiles.forEach((file) => {
    console.log(`   - ${file.s3Key}`);
  });
  console.log("");

  // Upload all files
  const results = [];
  for (const file of imageFiles) {
    const url = await uploadFile(file.localPath, file.s3Key);
    if (url) {
      results.push({
        localPath: file.localPath,
        s3Key: file.s3Key,
        url: url,
      });
    }
  }

  // Summary
  console.log("");
  console.log("📊 Upload Summary:");
  console.log(
    `✅ Successfully uploaded: ${results.length}/${imageFiles.length} files`
  );

  if (results.length > 0) {
    console.log("");
    console.log("📝 Generated URL mapping (for your code):");
    console.log("const imageUrls = {");
    results.forEach((result) => {
      const relativePath = path
        .relative(ASSETS_PATH, result.localPath)
        .replace(/\\/g, "/");
      console.log(`  '${relativePath}': '${result.url}',`);
    });
    console.log("};");
  }
}

// Run the script
uploadAllImages().catch(console.error);
