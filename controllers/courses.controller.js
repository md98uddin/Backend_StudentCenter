const router = require("express").Router();
const services = require("../utils/services");
const Course = require("../models/courses.model");

//return all courses in db
router.route("/").get((request, response) => {
  Course.find()
    .then(res => {
      response.status(200).send(res);
    })
    .catch(error => {
      response.status(404).send(error.message);
    });
});

//return courses by campus

//return courses by campus and department

//add a course to db
router.route("/add").post(async (request, response) => {
  const {
    department,
    prefix,
    courseNumber,
    professor,
    room,
    days,
    credits,
    grade,
    semester,
    campus,
    section
  } = request.body;

  //validation logic
  const { error, value } = services.validateCourse(request.body);

  //save to mongo
  if (!error) {
    const courseExists = await Course.find({ prefix })
      .and({ courseNumber })
      .and({ section });
    if (!courseExists.length > 0) {
      const course = new Course(request.body);
      course
        .save()
        .then(res => {
          response
            .status(200)
            .send(`the following object was created => ${res}`);
        })
        .catch(error => {
          response.send(`something went wrong => ${error}`);
        });
    } else {
      response.status(400).send("this course with section number exists");
    }
  } else {
    response.status(400).send(`encountered errors in fields => ${error}`);
  }
});

//modify a course in db

module.exports = router;
