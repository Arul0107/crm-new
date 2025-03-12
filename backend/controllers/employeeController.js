  const Employee = require('../models/Employee');
  const designationConfig = require('../utils/designationConfig');
  require('dotenv').config();
  // Get all designations
  exports.getDesignations = (req, res) => {
    res.json(Object.keys(designationConfig));
  };

  // Get departments and department IDs for a designation
  exports.getDepartments = (req, res) => {
    const { designation } = req.params;
    res.json(designationConfig[designation] || {});
  };

  // Get employment types
  exports.getEmploymentTypes = (req, res) => {
    res.json(["Permanent", "Contract", "Intern"]);
  };

  // Create employee
  // Create employee
  exports.createEmployee = async (req, res) => {
    try {
      // Auto-generate employee ID
      const latestEmployee = await Employee.findOne().sort({ employeeId: -1 });
      const newId = latestEmployee ? 
        parseInt(latestEmployee.employeeId.slice(3)) + 1 : 1;
      const employeeId = 'EMP' + String(newId).padStart(4, '0');

      // Use password from environment variable
      const defaultPassword = process.env.DEFAULT_PASSWORD;

      const employee = new Employee({
        ...req.body,
        employeeId,
        password: defaultPassword
      });

      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// ✅ Fetch all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// ✅ Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};

// ✅ Update employee details dynamically
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });

    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ error: "Employee not found" });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

// Update employee permissions
exports.updateEmployeePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get employee permissions
exports.getEmployeePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee.permissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee permissions" });
  }
};