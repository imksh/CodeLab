import cloudinary from "../config/cloudinary.js";

export const UploadMultipleToCloudinary = async (multipleImages, folder) => {
  try {
    const uploadMultiple = multipleImages.map(async (imgfile) => {
      const b64 = Buffer.from(imgfile.buffer).toString("base64");
      const dataURI = `data:${imgfile.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder || "CodeLab",
      });

      return {
        url: result.secure_url,
        publicID: result.public_id,
      };
    });

    const uploadedImages = await Promise.all(uploadMultiple);
    console.log("Uploaded Images: ", uploadedImages);
    return uploadedImages;
  } catch (error) {
    console.log("Cloudinary Error ", error);
    throw new Error("Image upload failed");
  }
};
