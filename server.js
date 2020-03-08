const express = require("express");
const cors = require("cors");
const mongoAtlas = require("./constants/mongoAtlas");

var app = express();
const port = 3000 || process.env.PORT;
app.use(express.json());
app.use(cors());

const courseRoutes = require("./controllers/courses.controller");
const studentRoutes = require("./controllers/students.controller");
app.use("/courses", courseRoutes);
app.use("/students", studentRoutes);

mongoAtlas.connectToAtlas();
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
