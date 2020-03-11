const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const faculties = new Schema(
  {
    department: {
      type: String,
      required: true,
      enum: ["Math", "Comp Sci", "Romance Language", "Business"]
    },
    employeeType: {
      type: String,
      required: true,
      enum: ["Professor", "Adviser"]
    },
    name: { type: String, required: true, maxlength: 64, minlength: 2 },
    room: { type: String, required: true, maxlength: 64, minlength: 2 },
    hours: { type: String, required: true, maxlength: 64, minlength: 2 },
    days: {
      type: Array,
      required: true,
      default: []
    },
    facultyId: { type: String, required: true, maxlength: 64, minlength: 6 },
    campusId: {
      type: Number,
      required: true,
      max: 9999,
      min: 1000
    },
    contact: { type: Object, required: true }
  },
  {
    timestamps: true
  }
);

const Faculty = mongoose.model("Faculty", faculties);

module.exports = Faculty;
