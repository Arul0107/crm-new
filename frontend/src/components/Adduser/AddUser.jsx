import React, { useState, useEffect } from 'react';
import { getDesignations, getDepartments, getEmploymentTypes, createEmployee } from '../../api';
import { Form, Input, Select, DatePicker, Button, Steps, Card, Modal } from 'antd';
import { UserOutlined, BankOutlined, IdcardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';

const { Step } = Steps;
const { Option } = Select;

function AddUser() {
  const [step, setStep] = useState(0); // Step counter
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      contactNumber: '',
      address: ''
    },
    companyInfo: {
      designation: '',
      department: '',
      departmentId: '',
      employmentType: ''
    },
    bankDetails: {
      bankName: '',
      ifscCode: '',
      accountNumber: ''
    }
  });
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Fetch initial data
    getDesignations().then(res => setDesignations(res.data));
    getEmploymentTypes().then(res => setEmploymentTypes(res.data));
  }, []);

  const handleDesignationChange = async (designation) => {
    setFormData({
      ...formData,
      companyInfo: {
        ...formData.companyInfo,
        designation,
        department: '',
        departmentId: ''
      }
    });

    // Fetch departments and department IDs
    const res = await getDepartments(designation);
    setDepartments(res.data.departments || []);
    setDepartmentIds(res.data.departmentIds || []);
  };

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createEmployee(formData);
      console.log('Employee created:', res.data);
      setEmployeeId(res.data.employeeId);
      setPassword(res.data.password);
      setStep(4); // Move to the success step

      // Show modal with employee credentials
      setIsModalVisible(true);

      // Also display employee ID and password using hot-toast
      toast.success(
        (t) => (
          <div onClick={() => toast.dismiss(t.id)}>
            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>Employee created successfully!</p>
            <p><strong>Employee ID:</strong> {res.data.employeeId}</p>
            <p><strong>Password:</strong> {res.data.password}</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Click to dismiss</p>
          </div>
        ),
        {
          duration: 10000, // Longer duration
          style: {
            background: '#4caf50',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '14px',
          }
        }
      );

      // Reset the form after submission
      setFormData({
        personalInfo: {
          firstName: '',
          lastName: '',
          dob: '',
          email: '',
          contactNumber: '',
          address: ''
        },
        companyInfo: {
          designation: '',
          department: '',
          departmentId: '',
          employmentType: ''
        },
        bankDetails: {
          bankName: '',
          ifscCode: '',
          accountNumber: ''
        }
      });
    } catch (error) {
      console.error('Creation error:', error);
      toast.error('Failed to create employee. Please try again.', {
        duration: 4000,
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        }
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const steps = [
    {
      title: 'Personal Info',
      icon: <UserOutlined />,
      content: (
        <Card title="Personal Info">
          <Form layout="vertical">
            <Form.Item label="First Name" required>
              <Input
                name="firstName"
                value={formData.personalInfo.firstName}
                onChange={(e) => handleChange(e, 'personalInfo')}
              />
            </Form.Item>
            <Form.Item label="Last Name" required>
              <Input
                name="lastName"
                value={formData.personalInfo.lastName}
                onChange={(e) => handleChange(e, 'personalInfo')}
              />
            </Form.Item>
            <Form.Item label="Date of Birth" required>
              <DatePicker
                style={{ width: '100%' }}
                onChange={(date, dateString) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      dob: dateString
                    }
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input
                type="email"
                name="email"
                value={formData.personalInfo.email}
                onChange={(e) => handleChange(e, 'personalInfo')}
              />
            </Form.Item>
            <Form.Item label="Phone Number" required>
              <Input
                name="contactNumber"
                value={formData.personalInfo.contactNumber}
                onChange={(e) => handleChange(e, 'personalInfo')}
              />
            </Form.Item>
            <Form.Item label="Address" required>
              <Input
                name="address"
                value={formData.personalInfo.address}
                onChange={(e) => handleChange(e, 'personalInfo')}
              />
            </Form.Item>
          </Form>
          <Button type="primary" onClick={nextStep}>
            Next
          </Button>
        </Card>
      )
    },
    {
      title: 'Company Info',
      icon: <IdcardOutlined />,
      content: (
        <Card title="Company Info">
          <Form layout="vertical">
            <Form.Item label="Designation" required>
              <Select
                placeholder="Select Designation"
                value={formData.companyInfo.designation}
                onChange={handleDesignationChange}
              >
                {designations.map(d => (
                  <Option key={d} value={d}>{d}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Department" required>
              <Select
                placeholder="Select Department"
                value={formData.companyInfo.department}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    companyInfo: {
                      ...formData.companyInfo,
                      department: value,
                      departmentId: ''
                    }
                  })
                }
                disabled={!formData.companyInfo.designation}
              >
                {departments.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Department ID" required>
              <Select
                placeholder="Select Department ID"
                value={formData.companyInfo.departmentId}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    companyInfo: {
                      ...formData.companyInfo,
                      departmentId: value
                    }
                  })
                }
                disabled={!formData.companyInfo.department}
              >
                {departmentIds.map(id => (
                  <Option key={id} value={id}>{id}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Employment Type" required>
              <Select
                placeholder="Select Employment Type"
                value={formData.companyInfo.employmentType}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    companyInfo: {
                      ...formData.companyInfo,
                      employmentType: value
                    }
                  })
                }
              >
                {employmentTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <Button style={{ marginRight: 8 }} onClick={prevStep}>
            Back
          </Button>
          <Button type="primary" onClick={nextStep}>
            Next
          </Button>
        </Card>
      )
    },
    {
      title: 'Bank Details',
      icon: <BankOutlined />,
      content: (
        <Card title="Bank Details">
          <Form layout="vertical">
            <Form.Item label="Bank Name" required>
              <Input
                name="bankName"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleChange(e, 'bankDetails')}
              />
            </Form.Item>
            <Form.Item label="IFSC Code" required>
              <Input
                name="ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={(e) => handleChange(e, 'bankDetails')}
              />
            </Form.Item>
            <Form.Item label="Account Number" required>
              <Input
                name="accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleChange(e, 'bankDetails')}
              />
            </Form.Item>
          </Form>
          <Button style={{ marginRight: 8 }} onClick={prevStep}>
            Back
          </Button>
          <Button type="primary" onClick={nextStep}>
            Next
          </Button>
        </Card>
      )
    },
    {
      title: 'Review & Submit',
      icon: <CheckCircleOutlined />,
      content: (
        <Card title="Review & Submit">
          <h3>Personal Info</h3>
          <p>First Name: {formData.personalInfo.firstName}</p>
          <p>Last Name: {formData.personalInfo.lastName}</p>
          <p>Date of Birth: {formData.personalInfo.dob}</p>
          <p>Email: {formData.personalInfo.email}</p>
          <p>Phone Number: {formData.personalInfo.contactNumber}</p>
          <p>Address: {formData.personalInfo.address}</p>

          <h3>Company Info</h3>
          <p>Designation: {formData.companyInfo.designation}</p>
          <p>Department: {formData.companyInfo.department}</p>
          <p>Department ID: {formData.companyInfo.departmentId}</p>
          <p>Employment Type: {formData.companyInfo.employmentType}</p>

          <h3>Bank Details</h3>
          <p>Bank Name: {formData.bankDetails.bankName}</p>
          <p>IFSC Code: {formData.bankDetails.ifscCode}</p>
          <p>Account Number: {formData.bankDetails.accountNumber}</p>

          <Button style={{ marginRight: 8 }} onClick={prevStep}>
            Back
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Card>
      )
    },
    {
      title: 'Success',
      icon: <CheckCircleOutlined />,
      content: (
        <Card title="Employee Created Successfully">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '16px' }} />
            <h2>Employee has been created successfully!</h2>
            <p>The employee ID and password have been generated.</p>
            <div style={{ margin: '20px 0', padding: '16px', border: '1px dashed #ccc', borderRadius: '8px', background: '#f9f9f9' }}>
              <p><strong>Employee ID:</strong> {employeeId}</p>
              <p><strong>Password:</strong> {password}</p>
            </div>
            <p>Please make a note of these credentials as they will be needed for login.</p>
            <Button type="primary" onClick={() => setStep(0)}>Add Another Employee</Button>
          </div>
        </Card>
      )
    }
  ];

  // Modal to display employee credentials
  const credentialsModal = (
    <Modal
      title="Employee Created Successfully"
      open={isModalVisible}
      onOk={() => setIsModalVisible(false)}
      onCancel={() => setIsModalVisible(false)}
      footer={[
        <Button key="ok" type="primary" onClick={() => setIsModalVisible(false)}>
          OK
        </Button>
      ]}
    >
      <div style={{ padding: '20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
        </div>
        <div style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#f9f9f9' }}>
          <h3 style={{ marginTop: 0 }}>Login Credentials</h3>
          <p><strong>Employee ID:</strong> {employeeId}</p>
          <p style={{ marginBottom: 0 }}><strong>Password:</strong> {password}</p>
        </div>
        <p style={{ marginTop: '16px', color: '#ff4d4f' }}>
          Please save these credentials. They will be needed for login.
        </p>
      </div>
    </Modal>
  );

  return (
    <div>
      <Steps current={step} style={{ marginBottom: 24 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      {steps[step] && steps[step].content ? steps[step].content : <div>Step content not found</div>}
      {credentialsModal}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            zIndex: 9999,
          },
        }} 
      />
    </div>
  );
}

export default AddUser;