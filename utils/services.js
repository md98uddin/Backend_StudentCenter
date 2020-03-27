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
      "F",
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
    studentId: Joi.string()
      .required()
      .max(64)
      .min(8),
    gender: Joi.string()
      .required()
      .valid("Male", "Female", "Non-Binary"),
    year: Joi.string()
      .required()
      .valid("Freshmen", "Sophomore", "Junior", "Senior"),
    campusId: Joi.number()
      .required()
      .max(9999)
      .min(1000)
      .valid(1234, 2345, 3456, 4567),
    major: Joi.string()
      .valid(
        "Math",
        "Business",
        "Computer Science",
        "Romance Language",
        "Undeclared"
      )
      .default("Undeclared"),
    gpa: Joi.number()
      .required()
      .max(4)
      .min(0),
    credits: Joi.number()
      .required()
      .max(200)
      .min(0),
    tuition: Joi.number()
      .max(300000)
      .min(0)
      .default(0),
    attending: Joi.string()
      .required()
      .valid("Fulltime", "Parttime", "No"),
    adviser: Joi.object().required(),
    holds: Joi.array()
      .required()
      .min(0)
      .max(10),
    shopCart: Joi.array()
      .min(0)
      .max(8),
    transactions: Joi.array()
      .min(0)
      .max(8),
    currentClasses: Joi.array()
      .min(0)
      .max(8),
    classesCompleted: Joi.array()
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

function validateFaculty(adviser) {
  const Schema = Joi.object().keys({
    department: Joi.string()
      .required()
      .valid("Math", "Comp Sci", "Romance Language", "Business"),
    employeeType: Joi.string()
      .required()
      .valid("Professor", "Adviser"),
    name: Joi.string()
      .required()
      .max(64)
      .min(2),
    room: Joi.string()
      .required()
      .max(64)
      .min(2),
    hours: Joi.string()
      .required()
      .max(64)
      .min(2),
    days: Joi.array()
      .required()
      .max(7)
      .min(1),
    duration: Joi.object().required(),
    facultyId: Joi.string()
      .required()
      .max(64)
      .min(6),
    campusId: Joi.number()
      .required()
      .max(9999)
      .min(1000),
    contact: Joi.object()
      .required()
      .max(3)
      .min(1)
  });

  return Schema.validate(adviser);
}

module.exports = {
  validateCourse,
  validateStudent,
  validateFaculty
};
