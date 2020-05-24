const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')

class RecieverController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getRecieverList(req, res) {
    const {username} = req.params
    // lấy thông tin user
    let sql_1 = "CALL proc_viewBietDanh_IdTKNh(?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', 1, 10, 'BietDanh', 'giam'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    // const message = result_1[1][0].message
    // const split = message.split(':')
    // console.log(split)
    // if (split[0] != 0) {
    //   return res.status(422).send({
    //     success: false,
    //     result_code: +split[0],
    //     message: split[1]
    //   })
    // }

    res.send({
      data: result_1[0],
      success: true,
      result_code: 0,
      message: "Lấy thông tin thành công!!!"
    })
  }

  async create(req, res) {
    const data = req.body
    console.log(data)
    let sql_1 = "CALL proc_ThemBietDanh(?,?,?,?, @kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [data.Username_IN, data.BietDanh_IN, Number(data.ID_TaiKhoan_TTTK_B_IN), data.TenNganHang_IN])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')
    console.log(split)

    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    res.send({
      success: true,
      result_code: 0,
      message: split[1]
    })
  }

  async update(req, res) {
    const {username} = req.params
    const data = req.body
    console.log(data)
    let sql_1 = "CALL proc_SuaBietDanh(?,?,?,?, @kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, data.BietDanh_IN, Number(data.ID_TaiKhoan_TTTK_B_IN), data.TenNganHang_IN])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')
    console.log(split)
    
    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    res.send({
      success: true,
      result_code: 0,
      message: split[1]
    })
  }

  async delete(req, res) {
    const {id} = req.params
    const {ID_TaiKhoan_TTTK_B, TenNganHang} = req.body

    let sql_1 = "CALL proc_XoaBietDanh(?,?,?, @kq); select @kq as `message`";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [id, ID_TaiKhoan_TTTK_B, TenNganHang])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')
    console.log(split)
    
    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    res.send({
      success: true,
      result_code: 0,
      message: split[1]
    })

  }

}

module.exports = RecieverController