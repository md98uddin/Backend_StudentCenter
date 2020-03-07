const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const registeredUsersSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 6,
      maxlength: 64
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 1024,
      required: true
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
    gpa: {
      type: Number,
      max: 4,
      required: true
    },
    credits: {
      type: Number,
      max: 200,
      required: true
    },
    attending: {
      type: Boolean,
      required: true
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true,
      unique: true
    },
    adviser: {
      type: { name: String, department: String, office: String, hours: String },
      required: true
    },
    holds: {
      type: [{ holdID: String, holdName: String, description: String }]
    },
    currentClasses: {
      type: [
        {
          department: String,
          coursePrefix: String,
          courseNumber: String,
          courseProfessor: String,
          courseDays: {}
        }
      ]
    },
    classesComplete: {
      type: [
        {
          department: String,
          coursePrefix: String,
          courseNumber: String,
          courseProfessor: String,
          grade: String
        }
      ]
    },
    studentPic: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const RegisteredStudents = mongoose.model(
  "RegisteredStudents",
  registeredUsersSchema
);

module.exports = RegisteredStudents;
