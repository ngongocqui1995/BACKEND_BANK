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
      message: "Lấy thông tin thành công!!!"
    })
  }

  async create(req, res) {
    const data = req.body
    console.log(data)

    let sql_1 = "CALL proc_ThemBietDanh(?,?,?,?, @kq)";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [data.Username_IN, data.BietDanh_IN, Number(data.ID_TaiKhoan_TTTK_B_IN), data.TenNganHang_IN])

    console.log(result_1)

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    console.log("-Lấy thông tin user thành công!!!")

    res.send({
      success: true,
      message: "Tạo biệt danh thành công!!!"
    })
  }

}

module.exports = RecieverController