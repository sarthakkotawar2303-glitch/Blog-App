const Cloudinary = require("../config/cloudinaryConfig");

const uploadToCloudinary = async (filepath) => {
  try {
    const result = await Cloudinary.uploader.upload(filepath, {
      folder: "blog-covers", // optional but recommended
    });

    return {
      url: result.secure_url,
      publicId: result.public_id, //   key name
    };
  } catch (error) {
    console.error("Error while uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = uploadToCloudinary;
