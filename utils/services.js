const Joi = require("@hapi/joi");

function validateCourse(course) {
  const Schema = Joi.object().keys({
    department: Joi.string()
      .required()
      .valid("Math", "Comp Sci", "Romance Language", "Business"),
    prefix: Joi.string()
      .required()
      .valid("CSCI", "MATH", "ECON", "LANG")
      .default("CSCI"),
    courseNumber: Joi.number()
      .required()
      .max(99999)
      .min(1000),
    professor: Joi.string()
      .required()
      .max(64)
      .min(2),
    room: Joi.string()
      .required()
      .max(10)
      .min(2),
    days: Joi.array()
      .required()
      .min(1)
      .max(7),
    credits: Joi.number()
      .required()
      .max(5.5)
      .min(0),
    semester: Joi.number()
      .required()
      .valid("Fall", "Spring", "Summer", "Winter"),
    year: Joi.number()
      .required()
      .max(2100)
      .min(new Date().getFullYear()),
    grade: Joi.string().valid(
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
    ),
    campus: Joi.string()
      .required()
      .valid(
        "Hunter College",
        "Baruch College",
        "City College",
        "York College"
      ),
    campusId: Joi.number()
      .required()
      .max(9999)
      .min(1000)
      .valid(1234, 2345, 3456, 4567),
    section: Joi.number()
      .required()
      .max(10000)
      .min(1)
  });

  return Schema.validate(course);
}

function validateStudent(student) {
  const Schema = Joi.object().keys({
    email: Joi.string()
      .required()
      .max(255)
      .min(5),
    firstName: Joi.string()
      .required()
      .max(48)
      .min(2),
    middleName: Joi.string()
      .max(48)
      .min(2),
    lastName: Joi.string()
      .required()
      .max(48)
      .min(2),
    gender: Joi.string()
      .required()
      .valid("Male", "Female", "Non-Binary"),
    year: Joi.string()
      .required()
      .valid("Freshmen", "Sophomore", "Junior", "Senior"),
    gpa: Joi.number()
      .required()
      .max(4)
      .min(0),
    credits: Joi.number()
      .required()
      .max(200)
      .min(0),
    attending: Joi.string()
      .required()
      .valid("Fulltime", "Parttime", "No"),
    adviser: Joi.array()
      .required()
      .min(0)
      .max(3),
    holds: Joi.array()
      .required()
      .min(0)
      .max(10),
    currentClasses: Joi.array()
      .required()
      .min(0)
      .max(8),
    classesCompleted: Joi.array()
      .required()
      .min(0)
      .max(100),
    studentPic: Joi.string(),
    registrationCode: Joi.string()
      .required()
      .max(12)
      .min(6)
  });

  return Schema.validate(student);
}

module.exports = {
  validateCourse,
  validateStudent
};
