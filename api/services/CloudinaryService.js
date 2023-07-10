const cloudinary = require("cloudinary");
const multer = require('multer')

cloudinary.config({
  cloud_name: "dbduq5yyzE",
  api_key: "622879777149479",
  api_secret: "nz-v05L-bvmGZDeGvekgQJANP3s",
});

module.exports = {
  uploadImage: async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      return result.secure_url;
    } catch (error) {
      throw error;
    }
  },

  uploadPdf: async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: "raw",
        format: "pdf",
      });
      return result.secure_url;
    } catch (err) {
      throw err;
    }
  },
};
