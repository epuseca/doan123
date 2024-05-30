const { bcryptUtil } = require("../config/hash")
const bcrypt = require('bcrypt');
const { createUser, postUploadImg, getUser, uUser, dUser, getUserById, getUserByUsername }
  = require("../service/userService")

const { uploadSingleFile } = require("../service/userService")
const jwt = require('jsonwebtoken');

const CTDT = require('../models/ctdt')
const User = require('../models/user')


module.exports = {
  postImageUser: async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const userId = req.body.userId; // Assuming userId is sent in the request body
    if (!userId) {
      return res.status(400).send('User ID is required.');
    }

    let result = await postUploadImg(req.files.image, userId);
    console.log("Check results: ", result);

    if (result.status === 'success') {
      return res.status(200).json({
        errorCode: 0,
        data: result
      });
    } else {
      return res.status(500).json({
        errorCode: 1,
        error: result.error
      });
    }
  },
  // registerUser: async (req, res) => {
  //   const body = {
  //     mssv: req.body.mssv,
  //     name: req.body.name,
  //     email: req.body.email,
  //     address: req.body.address,
  //     sex: req.body.sex,
  //     role: 'student',
  //     username: req.body.username,
  //     password: req.body.password,
  //     description: []
  //   }
  //   await createUser(body);
  //   return res.status(200).json(
  //     {
  //       errorCode: 0,
  //     }
  //   )
  // },
  getUserAPIById: async (req, res) => {
    let result = await getUserById(req.params.iduser)
    console.log(req.params)
    return res.status(200).json(
      {
        errorCode: 0,
        data: result
      }
    )
  },
  getStudentByCTDTAPI: async (req, res) => {
    try {
      let results = await User.find({});
      // Lọc những người dùng có role là 'student'
      let students = results.filter(user => user.role === 'student');
      return res.render('build/pages/listStudent', { listUserByCTDT: students });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
  getStudentAPI: async (req, res) => {
    let results = await CTDT.find({});
    return res.render('build/pages/student_management', { listCTDT: results })
  },
  getUsersAPI: async (req, res) => {
    let result = await getUser(req.query)
    return res.status(200).json(
      {
        errorCode: 0,
        data: result
      }
    )
  },

  postCreateUserAPI: async (req, res) => {
    let result = await createUser(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },

  putUpdateUserAPI: async (req, res) => {
    let result = await uUser(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },

  deleteUserAPI: async (req, res) => {
    let result = await dUser(req.body.id)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  loginUser: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
        username: user.username,
    }, 'namdv', { expiresIn: '1h' }); 

    res.cookie('token', token, { httpOnly: true });
    return res.status(200).json({ message: 'Login successful', token });
  }
}



