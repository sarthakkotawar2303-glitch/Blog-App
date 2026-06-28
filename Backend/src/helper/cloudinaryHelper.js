const Cloudinary = require("../config/cloudinaryConfig");

/**
 * @name uploadToCloudinary
 * @description Uploads a file to Cloudinary.
 * @param {string} filepath - The path to the file to upload.
 * @returns {object} An object containing the file URL and public ID.
 */
const uploadToCloudinary = async (filepath) => {
  try {
    const result = await Cloudinary.uploader.upload(filepath, {
      folder: "blog-covers", 
    });

    return {
      url: result.secure_url,
      publicId: result.public_id, 
    };
  } catch (error) {
    console.error("Error while uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = uploadToCloudinary;
