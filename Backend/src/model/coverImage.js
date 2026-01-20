const mongoose = require("mongoose");

const coverImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoverImage", coverImageSchema);
