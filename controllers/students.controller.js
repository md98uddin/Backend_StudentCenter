const router = require("express").Router();
const services = require("../utils/services");
const Course = require("../models/students.model");
const Student = require("../models/students.model");

/**TESTED AND WORKING */
//return students by campusId OR campusId and college year
router.route("/").get(async (request, response) => {
  const { campusId, year } = request.query;
  var students = await Student.find();
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

/**TESTED AND WORKING */
//return a single student by email
router.route("/:email").get(async (request, response) => {
  const { email } = request.params;
  const student = await Student.find({ email });
  if (student.length > 0) {
    return response.status(200).send(student);
  } else {
    return response.status(400).send("no student matches such email");
  }
});

/**TESTED AND WORKING */
//add a student to db
router.route("/add").post(async (request, response) => {
  const {
    email,
    firstName,
    middleName,
    lastName,
    studentId,
    gender,
    year,
    campusId,
    gpa,
    credits,
    tuition,
    attending,
    adviser,
    holds,
    currentClasses,
    classesComplete,
    studentPic,
    registrationCode
  } = request.body;

  const { error } = services.validateStudent(request.body);
  if (!error) {
    const studentExists = await Student.find({ email });
    if (studentExists.length > 0) {
      return response
        .status(200)
        .send("student with email/code already exists");
    } else {
      const student = new Student(request.body);
      student
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

//modify a student

//add a course to student currentClasses array
router.route("/add/:email").post(async (request, response) => {
  const { email } = request.params;
  const student = await Student.find({ email: id });
  if (student.length > 0) {
  }
  return response.status(400).send("no one found");
});

//add grade to a currentClasses index and push to classesComplete

/**TESTED AND WORKING */
//add or subtract tuition cost of adding/dropping a class
router.route("/finance/:operator/:email").post(async (request, response) => {
  const { amount, credits } = request.query;
  const { email, operator } = request.params;

  if (!operator || !email || !credits) {
    return response.status(400).send("operator/email/credits can't be null");
  } else {
    var plusMinusCost = credits * 175;
    var student = await Student.find({ email });
    if (student.length > 0) {
      if (operator === "add") {
        Student.updateOne(
          { email },
          { tuition: student[0].tuition + plusMinusCost },
          () => {
            return response
              .status(200)
              .send(`added $${plusMinusCost} to tuition`);
          }
        );
      } else if (operator === "subtract") {
        Student.updateOne(
          { email },
          { tuition: student[0].tuition - plusMinusCost },
          () => {
            return response
              .status(200)
              .send(`subtracted $${plusMinusCost} from tuition`);
          }
        );
      } else if (operator === "pay") {
        Student.updateOne(
          { email },
          { tuition: student[0].tuition - amount },
          () => {
            return response
              .status(200)
              .send(`subtracted $${amount} from tuition`);
          }
        );
      } else {
        return response.status(400).send("invalid operator");
      }
    } else {
      return response.status(400).send("no student found with such email");
    }
  }
});

module.exports = router;
