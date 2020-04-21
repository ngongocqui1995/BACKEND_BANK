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

    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })
    if (numberRow.count === 0) return res.status(422).send({
      success: false,
      message: "Lấy thông tin thất bại!!!"
    })

    console.log("-Lấy thông tin user thành công!!!")


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

    console.log(result_1)

    let { state, message } = getStateMessage(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    if (!state) return res.status(422).send({
      success: false,
      message: message
    })

    console.log("-Chuyển tiền nội bộ thành công!!!")

    res.send({
      success: true,
      message: "Nạp tiền thành công!"
    })
  }

}

module.exports = EmployeeController