const { bcryptUtil } = require("../config/hash")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CTDT = require('../models/ctdt')
const User = require('../models/user')
const Course = require("../models/course")
const Class = require("../models/class")
const ClassExam = require("../models/classExam")
const classExam = require("../models/classExam")
const Joi = require('joi');

module.exports = {
  getClass: async (req, res) => {
    let results = await Class.find({});
    return res.render('build/pages/class_management.ejs', { listClassByCourse: results })
  },
}