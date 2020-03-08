const router = require("express").Router();
const services = require("../utils/services");
const Course = require("../models/students.model");
const Student = require("../models/students.model");

//return all students by campusId OR campusId and college year
router.route("/").get(async (request, response) => {
  const { campusId, year } = request.query;
  const students = await Student.find();
  if (students) {
    if (campusId && year) {
      for (let i = 0; i < students.length; i++) {
        if (students[i].campusId !== campusId || students[i].year === year)
          students = students.splice(i, 1);
      }

      return response.status(200).send(students);
    } else if (campusId && !year) {
      for (let i = 0; i < students.length; i++) {
        if (students[i].campusId !== campusId) {
          students.splice(i, 1);
        }
      }
      return response.status(200).send(students);
    }
  } else {
  }
  return response.status(400).send("no students found with such criterias");
});

//add a student to db
router.route("/add").post(async (request, response) => {
  const {
    email,
    firstName,
    middleName,
    lastName,
    gender,
    year,
    gpa,
    credits,
    attending,
    adviser,
    holds,
    currentClasses,
    classesComplete,
    studentPic,
    registrationCode
  } = request.body;

  const { error, value } = services.validateStudent(request.body);
  if (!error) {
    const studentExists = await Student.find({ email });
    if (studentExists.length > 0) {
      return response
        .status(200)
        .send("student with email/code already exists");
    } else {
      const student = new Student(request.body);
      student.save();
    }
  }
  return response.status(400).send(error);
});

//modify a student
module.exports = router;
