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

      return response.send(students);
    } else if (campusId && !year) {
      for (let i = 0; i < students.length; i++) {
        if (students[i].campusId !== campusId) {
          students.splice(i, 1);
        }
      }
      return response.send(students);
    }
  } else {
  }
  return response.send("no students found with such criterias");
});

/**TESTED AND WORKING */
//return a single student by email
router.route("/:email").get(async (request, response) => {
  const { email } = request.params;
  const student = await Student.find({ email });
  if (student.length > 0) {
    return response.send(student);
  } else {
    return response.send("no student matches such email");
  }
});

/**TESTED AND WORKING */
//register use with code
router.route("/add/:registrationCode").get(async (request, response) => {
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
    request.body.email = await request.body.email.toLowerCase();
    if (!error) {
      const studentExists = await Student.find({ email: request.body.email });
      if (studentExists.length > 0) {
        return response.send("student with email already exists");
      } else {
        const student = new Student(request.body);
        student
          .save()
          .then(res => {
            return response.send(res);
          })
          .catch(error => {
            return response.send(error);
          });
      }
    } else {
      return response.send(error);
    }
  } else {
    return response.send("duplicate registrationCode. one exists in DB");
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
      return response.send(`user updated to following ${request.body.email}`);
    }).catch(error => {
      return response.send(error);
    });
  } else {
    return response.send(error);
  }
});

/**TESTED AND WORKING */
//get cart from user
router.route("/cart/:email").get(async (request, response) => {
  const { email } = request.params;
  if (!email) {
    return response.send("no email provided");
  } else {
    var student = await Student.find({ email });
    if (student.length <= 0) {
      return response.send("no student found");
    } else {
      return response.send(student[0].shopCart);
    }
  }
});

/**TESTED AND WORKING */
//add to cart
router.route("/cart/:email").post(async (request, response) => {
  const { email } = request.params;
  if (!email) {
    return response.send("no email provided");
  } else {
    var student = await Student.find({ email });
    if (student.length <= 0) {
      return response.send("no student found");
    } else {
      await student[0].shopCart.push(request.body);
      Student.updateOne({ email }, { shopCart: student[0].shopCart }, () => {
        return response.send("added to shopCart");
      });
    }
  }
});

//remove from cart
router.route("/cart/:email").put(async (request, response) => {
  const { email } = request.params;
  const { id } = request.query;
  if (!email) {
    return response.send("no email provided");
  } else {
    if (!id) {
      return response.send("no course id provided");
    } else {
      var student = await Student.find({ email });
      if (student.length <= 0) {
        return response.send("no students matches email");
      } else {
        var filtered = [];
        for (let i = 0; i < student[0].shopCart.length; i++) {
          if ((await student[0].shopCart[i]._id) !== id) {
            filtered.push(student[0].shopCart[i]);
          }
        }
        Student.updateOne({ email }, { shopCart: filtered }, () => {
          response.send("course removed");
        });
      }
    }
  }
});

/**TESTED AND WORKING */
//add a course to student currentClasses/classesComplete array
router.route("/add/:operator/:email").post(async (request, response) => {
  const { email, operator } = request.params;
  const { grade } = request.body;
  if (!email || !operator) {
    return response.send("email and operator can't be null");
  } else {
    var student = await Student.find({ email });
    if (student.length > 0) {
      if (operator === "current") {
        await student[0].currentClasses.push(request.body);
        Student.updateOne(
          { email },
          { currentClasses: student[0].currentClasses },
          () => {
            return response.send(student[0].currentClasses);
          }
        );
      } else if (operator === "completed") {
        if (!grade) {
          return response.send(`grade can't be null`);
        } else {
          await student[0].classesCompleted.push(request.body);
          Student.updateOne(
            { email },
            { classesCompleted: student[0].classesCompleted },
            () => {
              return response.send(student[0].classesCompleted);
            }
          );
        }
      } else {
        return response.send("invalid operator");
      }
    } else {
      return response.send("no student found");
    }
  }
});

/**TESTED AND WORKING */
//return current classes or one by id
router.route("/current/:email").get(async (request, response) => {
  const { email } = request.params;
  const { id } = request.query;
  if (!email) {
    return response.send("no email provided");
  } else {
    const student = await Student.find({ email });
    if (student.length <= 0) {
      return response.send("no student found");
    } else {
      if (id) {
        if (student[0].currentClasses.length <= 0) {
          return response.send("no course match id");
        } else if (student[0].currentClasses.length > 0) {
          for (let i = 0; i < student[0].currentClasses.length; i++) {
            if (student[0].currentClasses[i]._id === id) {
              return response.send("course exists");
            } else if (i === student[0].currentClasses.length - 1) {
              return response.send("none matched");
            }
          }
        }
      } else {
        return response.send(student[0].currentClasses);
      }
    }
  }
});

/**TESTED AND WORKING */
//add to currentClasses
router.route("/current/:email").post(async (request, response) => {
  const { email } = request.params;
  if (!email) {
    return response.send("no email provided");
  } else {
    const student = await Student.find({ email });
    if (student.length > 0) {
      await student[0].currentClasses.push(request.body);
      console.log("after update", student[0].currentClasses);
      Student.updateOne(
        { email },
        { currentClasses: student[0].currentClasses },
        () => {
          return response.send("added course to currentClasses");
        }
      );
    } else {
      return response.send("no student found with email");
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
      return response.send("prefix/courseNumber/section can't be null");
    } else {
      const student = await Student.find({ email });
      if (student.length > 0) {
        var course = await Course.find({
          _id: _id
        });
        if (!course.length > 0) {
          return response.send(
            "no such course found matching prefix/cn/section"
          );
        } else {
          var filtered = student[0].currentClasses.filter(function(value) {
            return value._id !== _id;
          });
          Student.updateOne({ email }, { currentClasses: filtered }, () => [
            console.log("filtered", filtered)
          ]);
        }
      } else {
        return response.send("no student found");
      }
    }
  } else {
    return response.send("email can't be null");
  }
});

/**TESTED AND WORKING */
//add or subtract tuition cost of adding/dropping a class or making a payment
router.route("/finance/:operator/:email").post(async (request, response) => {
  const { amount, credits } = request.query;
  const { email, operator } = request.params;

  if (!operator || !email || !credits) {
    return response.send("operator/email/credits can't be null");
  } else {
    var plusMinusCost = credits * 175;
    var student = await Student.find({ email });
    if (student.length > 0) {
      if (operator === "add") {
        Student.updateOne(
          { email },
          { tuition: student[0].tuition + plusMinusCost },
          () => {
            return response.send(student[0].tuition + plusMinusCost);
          }
        );
      } else if (operator === "subtract") {
        Student.updateOne(
          { email },
          { tuition: student[0].tuition - plusMinusCost },
          () => {
            return response.send(student[0].tuition - plusMinusCost);
          }
        );
      } else if (operator === "pay") {
        var newAmt = student[0].tuition - amount;
        Student.updateOne(
          { email },
          { tuition: student[0].tuition - amount },
          () => {
            return response.sendStatus(200);
          }
        );
      } else {
        return response.send("invalid operator");
      }
    } else {
      return response.send("no student found with such email");
    }
  }
});

router.route("/finance/transactions/:email").put(async (request, response) => {
  const { email } = request.params;
  if (!email) {
    return response.send("no email provided");
  } else {
    var student = await Student.find({ email });
    if (student.length <= 0) {
      return response.send("no students match email");
    } else {
      await student[0].transactions.push(request.body);
      Student.find({ email }, { transactions: student[0].transactions }, () => {
        return response.send("transaction added");
      });
    }
  }
});

module.exports = router;
