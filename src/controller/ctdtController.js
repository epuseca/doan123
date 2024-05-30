const { createCTDT, getCTDT, dCTDT, uCTDT } = require("../service/ctdtService")
const CTDT = require('../models/ctdt')

const Joi = require('joi');
module.exports = {
  postCreateCTDT: async (req, res) => {
    let result = await createCTDT(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  getAllCTDT: async (req, res) => {
    // res.render('build/pages/department_management.ejs')
    let results = await CTDT.find({});
    return res.render('build/pages/department_management.ejs', { listCTDT: results })
    // let result = await getCTDT(req.query)
    // return res.status(200).json({
    //   EC: 0,
    //   data: result
    // })
  },
  deleteCTDT: async (req, res) => {
    let result = await dCTDT(req.body.id)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
  updateCTDT: async (req, res) => {
    let result = await uCTDT(req.body)
    return res.status(200).json({
      EC: 0,
      data: result
    })
  },
}