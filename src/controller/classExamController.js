const { createClassExam, getClassExam, dClassExam, uClassExam }
  = require("../service/classExamService")

module.exports = {
  postCreateClassExam: async (req, res) => {
    let result = await createClassExam(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  getAllClassExam: async (req, res) => {
    let result = await getClassExam(req.query)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  deleteClassExam: async (req, res) => {
    let result = await dClassExam(req.body.id)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  updateClassExam: async (req, res) => {
    let result = await uClassExam(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
}