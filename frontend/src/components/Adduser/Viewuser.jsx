import React, { useState, useEffect } from "react";
import { Table, Button, Drawer, Form, Input, DatePicker, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";

const { Option } = Select;

const Viewuser = () => {
  const [users, setUsers] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // ✅ Fetch users dynamically
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  // ✅ Fetch designations dynamically
  const fetchDesignations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/designations");
      setDesignations(response.data);
    } catch (error) {
      toast.error("Failed to fetch designations.");
    }
  };

  // ✅ Fetch employment types dynamically
  const fetchEmploymentTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employment-types");
      setEmploymentTypes(response.data);
    } catch (error) {
      toast.error("Failed to fetch employment types.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDesignations();
    fetchEmploymentTypes();
  }, []);

  // ✅ Fetch departments & department IDs based on selected designation
  const handleDesignationChange = async (designation) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/departments/${designation}`);
      setDepartments(response.data.departments || []);
      setDepartmentIds(response.data.departmentIds || []);
      form.setFieldsValue({ companyInfo: { department: "", departmentId: "" } });
    } catch (error) {
      toast.error("Failed to fetch departments.");
    }
  };

  // ✅ Open Edit Drawer
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      personalInfo: {
        firstName: user.personalInfo.firstName,
        lastName: user.personalInfo.lastName,
        dob: user.personalInfo.dob ? moment(user.personalInfo.dob) : null,
        email: user.personalInfo.email,
        contactNumber: user.personalInfo.contactNumber,
        address: user.personalInfo.address,
      },
      companyInfo: {
        designation: user.companyInfo.designation,
        department: user.companyInfo.department,
        departmentId: user.companyInfo.departmentId,
        employmentType: user.companyInfo.employmentType,
      },
      bankDetails: {
        bankName: user.bankDetails.bankName,
        ifscCode: user.bankDetails.ifscCode,
        accountNumber: user.bankDetails.accountNumber,
      },
    });

    if (user.companyInfo.designation) {
      handleDesignationChange(user.companyInfo.designation);
    }

    setIsDrawerOpen(true);
  };

  // ✅ Update user dynamically with Toast notification
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.personalInfo.dob = values.personalInfo.dob ? values.personalInfo.dob.toISOString() : null;

      await axios.put(`http://localhost:5000/api/employees/${editingUser._id}`, values);

      setUsers(users.map(user => (user._id === editingUser._id ? { ...user, ...values } : user)));
      toast.success("User updated successfully!");
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  // ✅ Delete user dynamically with Toast notification
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "Name", dataIndex: "personalInfo", render: (p) => `${p.firstName} ${p.lastName}` },
    { title: "DOB", dataIndex: "personalInfo", render: (p) => (p.dob ? moment(p.dob).format("DD-MM-YYYY") : "N/A") },
    { title: "Email", dataIndex: "personalInfo", render: (p) => p.email },
    { title: "Contact", dataIndex: "personalInfo", render: (p) => p.contactNumber },
    { title: "Designation", dataIndex: "companyInfo", render: (c) => c.designation },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record._id)} okText="Yes" cancelText="No">
            <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ margin: "0 auto", padding: "20px" }}>
      <Toaster />
      <h2>User List</h2>
      <Table dataSource={users} columns={columns} rowKey="_id" />

      {/* Edit Drawer */}
      <Drawer title="Edit User" width={500} open={isDrawerOpen} onClose={() => { setIsDrawerOpen(false); form.resetFields(); }}
        footer={<div style={{ textAlign: "right" }}><Button onClick={() => setIsDrawerOpen(false)} style={{ marginRight: 8 }}>Cancel</Button><Button type="primary" onClick={handleSave}>Save</Button></div>}>
        
        <Form form={form} layout="vertical">
          <h3>Personal Information</h3>
          <Form.Item name={["personalInfo", "firstName"]} label="First Name"><Input /></Form.Item>
          <Form.Item name={["personalInfo", "lastName"]} label="Last Name"><Input /></Form.Item>
          <Form.Item name={["personalInfo", "dob"]} label="Date of Birth"><DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" /></Form.Item>
          <Form.Item name={["personalInfo", "email"]} label="Email"><Input /></Form.Item>
          <Form.Item name={["personalInfo", "contactNumber"]} label="Contact"><Input /></Form.Item>
          <Form.Item name={["personalInfo", "address"]} label="Address"><Input.TextArea /></Form.Item>

          <h3>Company Information</h3>
          <Form.Item label="Designation" name={["companyInfo", "designation"]}><Select onChange={handleDesignationChange}>{designations.map(d => <Option key={d} value={d}>{d}</Option>)}</Select></Form.Item>
          <Form.Item label="Department" name={["companyInfo", "department"]}><Select disabled={!departments.length}>{departments.map(d => <Option key={d} value={d}>{d}</Option>)}</Select></Form.Item>
          <Form.Item label="Department ID" name={["companyInfo", "departmentId"]}><Select disabled={!departmentIds.length}>{departmentIds.map(id => <Option key={id} value={id}>{id}</Option>)}</Select></Form.Item>
          <Form.Item label="Employment Type" name={["companyInfo", "employmentType"]}><Select>{employmentTypes.map(t => <Option key={t} value={t}>{t}</Option>)}</Select></Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Viewuser;
