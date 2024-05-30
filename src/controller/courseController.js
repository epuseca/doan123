const { createCourse, getCourse, dCourse, uCourse } = require("../service/courseService")



module.exports = {
  postCreateCourse: async (req, res) => {
    let result = await createCourse(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  getAllCourse: async (req, res) => {
    let result = await getCourse(req.query)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  deleteCourse: async (req, res) => {
    let result = await dCourse(req.body.id)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  updateCourse: async (req, res) => {
    let result = await uCourse(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
}