import axios from "axios";
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file); // The image file to upload
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  formData.append(
    "cloud_name",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
  );

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  // Return the secure URL of the uploaded image
  return response.data.secure_url;
};
