const { createClass, getClass, dClass, uClass } = require("../service/classService")

module.exports = {
  postCreateClass: async (req, res) => {
    let result = await createClass(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  getAllClass: async (req, res) => {
    let result = await getClass(req.query)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  deleteClass: async (req, res) => {
    let result = await dClass(req.body.id)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  updateClass: async (req, res) => {
    let result = await uClass(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
}