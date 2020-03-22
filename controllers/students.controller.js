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
    return response.send("no student matches such email");
  }
});

//register use with code
router.route("/add/:registrationCode").post(async (request, response) => {
  const { registrationCode } = request.params;
  const foundStudent = await Student.find({ registrationCode });
  if (foundStudent.length > 0) {
    return response.send("code matches");
  } else {
    return response.send("no code matches");
  }
});

/**TESTED AND WORKING */
//add a student to db
router.route("/add").post(async (request, response) => {
  const { error } = services.validateStudent(request.body);
  //check registration duplicate
  const regDuplicate = await Student.find({
    registrationCode: request.body.registrationCode
  });
  if (regDuplicate.length <= 0) {
    if (!error) {
      const studentExists = await Student.find({ email: request.body.email });
      if (studentExists.length > 0) {
        return response.status(200).send("student with email already exists");
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
  } else {
    return response
      .status(400)
      .send("duplicate registrationCode. one exists in DB");
  }
});

/**TESTED AND WORKING */
//modify a student (fname, lname, gender, address)
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

/**TESTED AND WORKING */
//remove a course
router.route("/remove/:email").post(async (request, response) => {
  const { email } = request.params;
  const { prefix, courseNumber, section, _id } = request.body;
  if (email) {
    if (!prefix || !courseNumber || !section) {
      return response
        .status(400)
        .send("prefix/courseNumber/section can't be null");
    } else {
      const student = await Student.find({ email });
      if (student.length > 0) {
        var course = await Course.find({
          _id: _id
        });
        if (!course.length > 0) {
          return response
            .status(400)
            .send("no such course found matching prefix/cn/section");
        } else {
          var filtered = student[0].currentClasses.filter(function(value) {
            return value._id !== _id;
          });
          Student.updateOne({ email }, { currentClasses: filtered }, () => [
            console.log("filtered", filtered)
          ]);
        }
      } else {
        return response.status(400).send("no student found");
      }
    }
  } else {
    return response.status(400).send("email can't be null");
  }
});

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
