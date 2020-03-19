const router = require("express").Router();
const services = require("../utils/services");
const Course = require("../models/courses.model");
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
  const { error } = services.validateStudent(request.body);
  if (!error) {
    const studentExists = await Student.find({ email: request.body.email });
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

//modify a student (needs scaling and fix)
router.route("/modify/:email").post(async (request, response) => {
  const { error } = services.validateStudent(request.body);
  const { email } = request.params;
  if (!error) {
    Student.updateOne({ email }, request.body, () => {
      console.log(request.body);
      return response
        .status(200)
        .send(`user updated to following ${request.body.email}`);
    }).catch(error => {
      return response.status(400).send(error);
    });
  } else {
    return response.status(400).send(error);
  }
});

/**TESTED AND WORKING */
//add a course to student currentClasses/classesComplete array
router.route("/add/:operator/:email").post(async (request, response) => {
  const { email, operator } = request.params;
  const { prefix, courseNumber, section, grade } = request.body;
  if (!email || !operator) {
    return response.status(400).send("email and operator can't be null");
  } else {
    var student = await Student.find({ email });
    if (student.length > 0) {
      if (operator === "current") {
        await student[0].currentClasses.push(request.body);
        Student.updateOne(
          { email },
          { currentClasses: student[0].currentClasses },
          () => {
            return response.status(400).send(student[0].currentClasses);
          }
        );
      } else if (operator === "completed") {
        if (!grade) {
          return response.status(400).send(`grade can't be null`);
        } else {
          await student[0].classesCompleted.push(request.body);
          Student.updateOne(
            { email },
            { classesCompleted: student[0].classesCompleted },
            () => {
              return response.status(400).send(student[0].classesCompleted);
            }
          );
        }
      } else {
        return response.status(400).send("invalid operator");
      }
    } else {
      return response.status(400).send("no student found");
    }
  }
});

//drop or swap a course

/**TESTED AND WORKING */
//add or subtract tuition cost of adding/dropping a class or making a payment
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
              .send(student[0].tuition + plusMinusCost);
          }
        );
      } else if (operator === "subtract") {
        Student.updateOne(
          { email },
          { tuition: student[0].tuition - plusMinusCost },
          () => {
            return response
              .status(200)
              .send(student[0].tuition - plusMinusCost);
          }
        );
      } else if (operator === "pay") {
        Student.updateOne(
          { email },
          { tuition: student[0].tuition - amount },
          () => {
            return response.status(200).send(student[0].tuition - amount);
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
