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
  getClassExams: async (req, res) => {
    try {
      let results = await ClassExam.find({})
        .populate({
          path: 'classId',
          populate: {
            path: 'idCourse', // Populate idCourse from class
            model: 'course' // Ensure the model is correct
          }
        })
        .populate({
          path: 'teacherId', // Populate teacherId to get teacher details
          select: 'name' // Only select the 'name' field from the user document
        });


      return res.render('build/pages/classexams_management.ejs', { listClassExam: results });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
  searchClassExamsByName: async (req, res) => {
    try {
      const { className } = req.body;

      let query = {};
      if (className) {
        query = { 'classId.name': { $regex: new RegExp(className, 'i') } };
      }

      let results = await ClassExam.find(query)
        .populate({
          path: 'classId',
          populate: {
            path: 'idCourse',
            model: 'course'
          }
        })
        .populate({
          path: 'teacherId',
          select: 'name'
        });

      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  getStudentByClassExam: async (req, res) => {
    try {
      const { idClassExam } = req.params;
      let classExamData = await classExam.findById(idClassExam).populate('idStudents').populate('idStudentsDiemDanh');
      if (!classExamData) {
        return res.status(404).send("Class Exam not found");
      }

      // Tạo danh sách sinh viên duy nhất và đánh dấu trạng thái
      let uniqueStudents = new Map();

      classExamData.idStudents.forEach(student => {
        uniqueStudents.set(student._id.toString(), { ...student._doc, inClass: true, attended: false });
      });

      classExamData.idStudentsDiemDanh.forEach(student => {
        if (uniqueStudents.has(student._id.toString())) {
          uniqueStudents.get(student._id.toString()).attended = true;
        } else {
          uniqueStudents.set(student._id.toString(), { ...student._doc, inClass: false, attended: true });
        }
      });

      return res.render('build/pages/listStudentInClassExam.ejs', {
        listStudentByClassExam: Array.from(uniqueStudents.values())
      });
    } catch (error) {
      console.error("Error fetching class exam data:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
  deteteStudent: async (req, res) => {

  },
}