const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');

class TransactionController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getAll(req, res) {
    const {bankName} = req.query
    let sql_1 = "CALL proc_viewGiaoDich(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', '', 1, 1000, 'ThoiGian', 'giam', bankName || '', 'BBC'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0].message
    const split = message.split(':')

    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    res.send({
      data: result_1[0],
      success: true,
      result_code: 0,
      message: split[1]
    })
  }

  async getOne(req, res) {
    // lấy danh sách giao dịch
    const { username } = req.params
    let sql_1 = "CALL proc_viewUserDSGiaoDichNo(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 10000, 'ThoiGian', 'giam'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0].message
    const split = message.split(':')
    console.log(split)
    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    console.log("-Lấy danh sách giao dịch thành công!!!")

    res.send({
      data: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy danh sách giao dịch thành công!"
    })
  }

  async internalTrans(req, res) {
    let { accountNumberA, accountNumberB, amount, note, payer, OTP_CODE, username, transType, ID_TraNo } = req.body
    const otp = await this.getOTP(username)

    if(otp != OTP_CODE) {
      return res.status(422).send({
        success: false,
        message: "Mã xác nhận OTP không đúng!"
      })
    }
    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA, 'BBC', accountNumberB, 'BBC', amount, transType, note, payer, ID_TraNo ||''])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    const message = result_1[1][0].message
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
      message: "Chuyển tiền thành công!"
    })
  }

  async externalTrans(req, res) {
    let { accountNumberA, accountNumberB, bankNameB, amount, note, payer, OTP_CODE, username } = req.body
    const otp = await this.getOTP(username)

    if(otp != OTP_CODE) {
      return res.status(422).send({
        success: false,
        message: "Mã xác nhận OTP không đúng!"
      })
    }
    // chuyển tiền nội bộ
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA, 'BBC', accountNumberB, bankNameB, amount, 'Gui', note, payer, ''])

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
      message: "Chuyển tiền thành công!"
    })
  }

  async getOTP(username) {
    console.log(username)
    let sql_1 = "CALL proc_viewOTP(?);";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['nguyensang280596@gmail.com'])

    console.log("GET OTP==", result_1[0])

    if (err_1) {
      console.log(err_1)
      return false
    }

    return result_1[0][0].ID_OTP
  }
 
  async sendOTP(req, res){
    const {username} = req.params
    const code = this.randomRange(100000, 999999) // random code
    const sendMail = this.sendMail(username, code)
    const OTP = this.createOTP(username, code) // save code in database
    Promise.all([sendMail, OTP]).then(values => { 
      res.send({
        success: true
      })
    }, reason => {
      res.send({
        success: false
      })
    });
  }

  async createOTP(username, code) {
    console.log(code)
    let sql_1 = "CALL proc_TaoOTP(?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, code])

    console.log(result_1)

    if (err_1) {
      console.log(err_1)
      return false
    }

    return true
  }

  sendMail(email, code) {
    const transporter = nodemailer.createTransport({ // config mail server
      service: 'Gmail',
      auth: {
        user: 'daochichteam@gmail.com',
        pass: 'maianhtuan'
      }
    });

    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'Thanh Batmon',
      to: email,
      subject: 'OTP Ngân hàng',
      text: 'Mã OTP để xác nhận là: ' + code,
    }

    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Message sent: ' + info.response);
      }
    });
  }

  randomRange(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min)
  }

}

module.exports = TransactionController