const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  password: { type: String, default: 'defaultPassword' },
  accountStatus: { type: String, default: 'active' },
  personalInfo: {
    firstName: String,
    lastName: String,
    dob: Date,
    email: String,
    contactNumber: String,
    address: String
  },
  companyInfo: {
    designation: String,
    department: String,
    departmentId: String,
    joiningDate: Date,
    employmentType: String
  },
  bankDetails: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    panNumber: String
  },
  permissions: {
    admin: { type: String, default: 'none' },
    leads: { type: String, default: 'none' },
    opportunities: { type: String, default: 'none' },
    accounts: { type: String, default: 'none' },
    notes: { type: String, default: 'none' },
    operations: { type: String, default: 'none' },
    payments: { type: String, default: 'none' },
    users: { type: String, default: 'none' },
    enquiry: { type: String, default: 'none' },
    exportData: { type: String, default: 'none' },
    workorder: { type: String, default: 'none' },
    googleSheet: { type: String, default: 'none' },
    dashboard: { type: String, default: 'none' },
    userPrivileges: { type: String, default: 'none' },
    sent: { type: String, default: 'none' },
    drafts: { type: String, default: 'none' },
    calendar: { type: String, default: 'none' },
    tasks: { type: String, default: 'none' },
    salesReports: { type: String, default: 'none' },
    analytics: { type: String, default: 'none' },
    generalSettings: { type: String, default: 'none' },
    security: { type: String, default: 'none' },
    notifications: { type: String, default: 'none' }
  }
});

module.exports = mongoose.model('Employee', employeeSchema);