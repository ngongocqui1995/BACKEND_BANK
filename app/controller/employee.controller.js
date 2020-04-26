const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')

class EmployeeController extends BaseController {
  constructor() {
    super(mongoose)
  }


  async getAll(req, res) {
    // lấy thông tin user
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', 'NV', '', 1, 1000, 'ID_TaiKhoan', 'giam'])

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
      message: "Lấy thông tin user thành công!!!"
    })
  }

  async topup(req, res) {
    let {accountNumberB, amount } = req.body

    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [1, 'BBC', accountNumberB, 'BBC', amount, 'Gui', 'He thong nap tien', 'A', ''])

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

    console.log("-Chuyển tiền nội bộ thành công!!!")

    res.send({
      success: true,
      message: "Nạp tiền thành công!"
    })
  }

}

module.exports = EmployeeController