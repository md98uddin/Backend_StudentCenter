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
    section: Joi.number()
      .required()
      .max(10000)
      .min(1)
  });

  return Schema.validate(course);
}

module.exports = {
  validateCourse
};
