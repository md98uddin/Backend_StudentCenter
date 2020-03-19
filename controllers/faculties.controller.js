const router = require("express").Router();
const services = require("../utils/services");
const Faculty = require("../models/faculties.model");

//return all faculty in db OR by employeeType OR employeeType and department
router.route("/").get(async (request, response) => {
  const { employeeType, department } = request.query;
  const faculties = await Faculty.find();
  if (faculties) {
    if (employeeType && department) {
      for (let i = 0; i < faculties.length; i++) {
        if (
          faculties[i].employeeType !== employeeType ||
          faculties[i].department === department
        )
          faculties = faculties.splice(i, 1);
      }

      return response.status(200).send(faculties);
    } else if (employeeType && !department) {
      for (let i = 0; i < faculties.length; i++) {
        if (faculties[i].employeeType !== employeeType) {
          faculties.splice(i, 1);
        }
      }
      return response.status(200).send(faculties);
    }
  } else {
  }
  return response.status(400).send("no faculties found with such criterias");
});

/**TESTED AND WORKING */
//add a faculty to db
router.route("/add").post(async (request, response) => {
  const { error } = services.validateFaculty(request.body);
  if (!error) {
    const faculties = await Faculty.find({ facultyId: request.body.facultyId });
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
