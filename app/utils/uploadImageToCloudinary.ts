import axios from "axios";
import imageCompression from "browser-image-compression";

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    // Configure compression options
    const compressionOptions = {
      maxSizeMB: 0.3, // 200KB
      maxWidthOrHeight: 1920, // Optional: Resize image to this max width/height
      useWebWorker: true, // Use web workers for faster compression
    };

    // Compress the image
    const compressedFile = await imageCompression(file, compressionOptions);

    // Prepare the FormData
    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    );

    // Upload to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    // Return the secure URL
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed.");
  }
};
