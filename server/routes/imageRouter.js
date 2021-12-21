const { Router } = require("express");
const imageRouter = Router();
const ImageSchema = require("../models/image");
const { upload } = require("../middlewares/imageUpload");

imageRouter.get("/", async (req, res) => {
  const image = await ImageSchema.find();
  return res.json(image);
});

imageRouter.post("/", upload.single("image"), async (req, res) => {
  const image = await new ImageSchema({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  return res.json(image);
});

module.exports = { imageRouter };
