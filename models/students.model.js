const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const students = new Schema(
  {
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      minlength: 2,
      maxlength: 48,
      required: true
    },
    middleName: {
      type: String,
      minlength: 2,
      maxlength: 48
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 48,
      required: true
    },
    studentId: { type: String, required: true, maxlength: 64, minlength: 8 },
    gender: {
      type: String,
      enum: ["Male", "Female", "Non-Binary"],
      required: true
    },
    year: {
      type: String,
      enum: ["Freshmen", "Sophomore", "Junior", "Senior"],
      required: true
    },
    major: {
      type: String,
      enum: [
        "Math",
        "Business",
        "Computer Science",
        "Romance Language",
        "Undeclared"
      ],
      required: true
    },
    gpa: {
      type: Number,
      max: 4,
      min: 0,
      required: true
    },
    credits: {
      type: Number,
      max: 200,
      min: 0,
      required: true
    },
    attending: {
      type: String,
      required: true,
      enum: ["Fulltime", "Parttime", "No"]
    },
    adviser: {
      type: Object,
      required: true
    },
    holds: {
      type: Array,
      default: []
    },
    currentClasses: {
      type: Array,
      default: []
    },
    classesCompleted: {
      type: Array,
      default: []
    },
    studentPic: {
      type: String
    },
    registrationCode: {
      type: String,
      required: true,
      max: 24,
      min: 6,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

const Student = mongoose.model("Students", students);

module.exports = Student;
