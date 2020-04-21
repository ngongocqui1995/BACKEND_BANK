const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')

class DebtController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getOneByUser(req, res) {
    const {username} = req.params
    
    let sql_1 = "CALL proc_viewUserDSGiaoDichNo(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 100, 'ThoiGian','giam'])
    
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

  async create(req, res) {
    let { username, accountNumberA, accountNumberB, amount, note, payer} = req.body
 
    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA, 'BBC', accountNumberB, 'BBC', amount, 'Doi', note, payer, ''])

    let { state, message } = getStateMessage(result_1[result_1.length - 1])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    if (!state) return res.status(422).send({
      success: false,
      message: message
    })

    const io = req.app.get('socketio');
    console.log(io)
    io.emit('DEBT_NOTICE', {username, accountNumberA, accountNumberB, amount, note, payer});
    
    console.log(result_1.message)

    res.send({
      success: true,
      message: message
    })
  }

  async removeDebt(req, res) {
    const {id} = req.params
    
    let sql_1 = "CALL proc_XoaDoi(?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [id])
    
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
      success: true,
      message: "Xóa thành công!!!"
    })
  }
}

module.exports = DebtController