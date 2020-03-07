const mongoose = require("mongoose");
require("dotenv").config();

const connectToAtlas = () => {
  return mongoose.connect(
    process.env.ATLAS_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => {
      console.log("connected to mongo atlas");
    }
  );
};
exports.connectToAtlas = connectToAtlas;
