const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeeController");
const Roles_List = require("../../config/roles");
const verifyRoles = require("../../middleware/verifyRoles");

router.route("/")
    .get(employeeController.getAllEmployees)
    .post(verifyRoles(Roles_List.Editor, Roles_List.Admin), employeeController.createNewEmployee)
    .put(verifyRoles(Roles_List.Editor, Roles_List.Admin), employeeController.updateEmployee)
    .delete(verifyRoles(Roles_List.Admin), employeeController.deleteEmployee);

router.route("/:id")
    .get(employeeController.getEmployeeByID);

module.exports = router;