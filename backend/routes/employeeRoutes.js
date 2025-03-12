const express = require('express');
const router = express.Router();
const {
  getDesignations,
  getDepartments,
  getEmploymentTypes,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeePermissions,
  getEmployeePermissions
} = require('../controllers/employeeController');

router.get('/designations', getDesignations);
router.get('/departments/:designation', getDepartments);
router.get('/employment-types', getEmploymentTypes);

router.post('/employees', createEmployee);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

router.put('/employees/:id/permissions', updateEmployeePermissions);
router.get('/employees/:id/permissions', getEmployeePermissions);

module.exports = router;