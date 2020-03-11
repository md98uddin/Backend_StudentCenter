const router = require("express").Router();
const services = require("../utils/services");
const Course = require("../models/courses.model");
const Student = require("../models/students.model");
const Faculty = require("../models/faculty.model");

//return all faculty in db OR by employeeType OR employeeType and department
router.route("/").get(async (request, response) => {
  const { employeeType, department } = request.query;
  const students = await Student.find();
  if (students) {
    if (employeeType && department) {
      for (let i = 0; i < students.length; i++) {
        if (
          students[i].employeeType !== employeeType ||
          students[i].department === department
        )
          students = students.splice(i, 1);
      }

      return response.status(200).send(students);
    } else if (employeeType && !department) {
      for (let i = 0; i < students.length; i++) {
        if (students[i].employeeType !== employeeType) {
          students.splice(i, 1);
        }
      }
      return response.status(200).send(students);
    }
  } else {
  }
  return response.status(400).send("no faculties found with such criterias");
});

//add a faculty to db
router.route("/add").post(async (request, response) => {
  const {
    department,
    employeeType,
    name,
    room,
    hours,
    days,
    facultyId,
    campusId,
    contact
  } = request.body;

  const { error } = services.validateFaculty(request.body);
  if (!error) {
    const faculties = await Faculty.find({ facultyId });
    if (faculties.length > 0) {
      return response.status(400).send("faculty with such id exists");
    } else {
      const faculty = new Faculty(request.body);
      faculty
        .save()
        .then(res => {
          return response.status(200).send(res);
        })
        .catch(error => {
          return response.status(400).send(error);
        });
    }
  } else {
    return response.status(400).send(error);
  }
});

//modify a faculty in db by facultyId

//remove a faculty in db by facultyId

module.exports = router;
