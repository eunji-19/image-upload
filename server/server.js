require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const { imageRouter } = require("./routes/imageRouter");
const userRouter = require("./routes/userRouter");

const { authentication } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb Connect");
    // app.use(express.static("uploads"));
    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(authentication);
    app.use("/images", imageRouter);
    app.use("/users", userRouter);

    app.listen(PORT, () =>
      console.log(`Express server is listening on ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
