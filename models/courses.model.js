const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courses = new Schema(
  {
    department: {
      type: String,
      required: true,
      enum: ["Math", "Comp Sci", "Romance Language", "Business"],
      default: "Math"
    },
    prefix: {
      type: String,
      required: true,
      enum: ["CSCI", "MATH", "ECON", "LANG"],
      default: "CSCI"
    },
    courseNumber: {
      type: Number,
      required: true,
      max: 99999,
      min: 1000
    },
    professor: {
      type: String,
      required: true,
      maxlength: 64,
      minlength: 2
    },
    room: { type: String, required: true, maxlength: 10, minlength: 2 },
    days: {
      type: Array,
      required: true
    },
    credits: { type: Number, required: true, max: 5.5, min: 0 },
    semester: {
      type: String,
      required: true,
      enum: ["Fall", "Spring", "Summer", "Winter"]
    },
    year: { type: Number, max: 2100, min: new Date().getFullYear() },
    grade: {
      type: String,
      enum: [
        "A+",
        "A",
        "A-",
        "B+",
        "B",
        "B-",
        "C+",
        "C",
        "C-",
        "D+",
        "D",
        "D-",
        "WD",
        "W",
        "WU",
        "WN",
        "CNC",
        "INC"
      ],
      required: false
    },
    campus: {
      type: String,
      required: true,
      enum: ["Hunter College", "Baruch College", "City College", "York College"]
    },
    campusId: {
      type: Number,
      required: true,
      max: 9999,
      min: 1000
    },
    section: { type: Number, required: true, max: 10000, min: 1 }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model("Courses", courses);

module.exports = Course;
