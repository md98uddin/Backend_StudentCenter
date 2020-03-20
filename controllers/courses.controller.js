const router = require("express").Router();
const services = require("../utils/services");
const Course = require("../models/courses.model");
const Student = require("../models/students.model");

//return all courses in db OR query by campus OR campus and department
router.route("/").get(async (request, response) => {
  const { campusId, prefix } = request.query;
  var courses = await Course.find();

  if (courses.length > 0) {
    if (campusId && prefix) {
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].campusId !== campusId || courses[i].prefix === prefix)
          courses = courses.splice(i, 1);
      }

      return response.status(200).send(courses);
    } else if (campusId && !prefix) {
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].campusId !== campusId) {
          courses.splice(i, 1);
        }
      }
      return response.status(200).send(courses);
    }
  } else {
    return response.status(200).send("can't find any courses matching query");
  }
});

/**TESTED AND WORKING */
//add a course to db
router.route("/add").post(async (request, response) => {
  const { prefix, courseNumber, campusId, section } = request.body;

  //validation logic
  const { error } = services.validateCourse(request.body);

  //save to mongo
  if (!error) {
    const courseExists = await Course.find({ prefix })
      .and({ courseNumber })
      .and({ section })
      .and({ campusId });
    if (!courseExists.length > 0) {
      const course = new Course(request.body);
      course
        .save()
        .then(res => {
          return response
            .status(200)
            .send(`the following object was created => ${res}`);
        })
        .catch(error => {
          return response.send(`something went wrong => ${error}`);
        });
    } else {
      return response
        .status(400)
        .send("this course with section number exists");
    }
  } else {
    return response
      .status(400)
      .send(`encountered errors in fields => ${error}`);
  }
});

//add a course to student completedClasses

//modify a course in db

module.exports = router;
