const Admin = require('../models/Admin');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const { generateOTP, verifyOTP } = require('../utils/otpStore');

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.signupStudent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const student = await Student.create({ name, email, password });
    res.status(201).json({ message: 'Student created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to signup student' });
  }
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const isMatch = await student.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const otp = generateOTP(email);
    console.log('OTP for student:', otp); // You should send via email in production
    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.verifyStudentOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const valid = verifyOTP(email, otp);
    if (!valid) return res.status(401).json({ error: 'Invalid OTP' });

    const student = await Student.findOne({ email });
    const token = createToken(student._id, 'student');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = createToken(admin._id, 'admin');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Admin login failed' });
  }
};
