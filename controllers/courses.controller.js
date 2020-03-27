const router = require("express").Router();
const services = require("../utils/services");
const Course = require("../models/courses.model");
const Student = require("../models/students.model");

/**TESTED AND WORKING */
//return all courses in db OR query by campus OR campus and prefix
router.route("/").get(async (request, response) => {
  const { prefix, campusId, courseNumber } = request.query;
  if (campusId) {
    var courses = await Course.find({ campusId });
    if (courses.length > 0) {
      if (campusId && !prefix) {
        const courseById = courses.filter(course => {
          return course.campusId !== campusId;
        });
        return response.send(courseById);
      } else if (prefix) {
        const courseByIdPrfx = courses.filter(course => {
          return course.prefix === prefix;
        });
        return response.send(courseByIdPrfx);
      }
    } else if (prefix && courseNumber) {
      const courseByPrfxNum = courses.filter(course => {
        return course.prefix === prefix && course.courseNumber === courseNumber;
      });
      return response.send(courseByPrfxNum);
    } else {
      return response.send("no courses match");
    }
  } else {
    return response.send("no campusId selected");
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
          return response.send(`the following object was created => ${res}`);
        })
        .catch(error => {
          return response.send(`something went wrong => ${error}`);
        });
    } else {
      return response.send("this course with section number exists");
    }
  } else {
    return response.send(`encountered errors in fields => ${error}`);
  }
});

//modify a course in db

module.exports = router;
