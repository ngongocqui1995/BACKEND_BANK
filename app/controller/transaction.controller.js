const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const moment =  require('moment')

class TransactionController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getAll(req, res) {
    const {bankA, bankB} = req.query
    console.log(req.query)
    let bankNameA = ''
    if(!bankA) {
      bankNameA = bankA
    }
    let bankNameB = ''
    if(!bankB) {
      bankNameB = bankB
    }
    console.log("BANK A=", bankA)
    console.log("BANK B=", bankB)
    let sql_1 = "CALL proc_viewGiaoDich(?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', '', 1, 1000, 'ThoiGian', 'giam', bankA, bankB])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    res.send({
      data: result_1[0],
      success: true,
      result_code: 0,
      message: 'Lấy giao dịch thành công!'
    })
  }

  async getOne(req, res) {
    // lấy danh sách giao dịch
    const { username } = req.params
    let sql_1 = "CALL proc_viewUserDSGiaoDichNo(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 1000, 'ThoiGian', 'giam'])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    res.send({
      data: result_1 ? result_1[0] ? result_1[0] : [] : [],
      success: true,
      message: "Lấy danh sách giao dịch thành công!"
    })
  }

  async internalTrans(req, res) {
    let { accountNumberA, accountNumberB, amount, note, payer, OTP_CODE, username, usernameB, transType, ID_TraNo } = req.body
    const otp = await this.getOTP(username)

    if(otp.length > 6) {
      return res.status(422).send({
        success: false,
        message: "Mã OTP đã hết thời gian!"
      })
    }

    if(otp != OTP_CODE) {
      return res.status(422).send({
        success: false,
        message: "Mã xác nhận OTP không đúng!"
      })
    }
    // chuyển tiền nội bộ
    const idTraNo = req.body.ID_TraNo || ''
    let sql_1 = "CALL proc_GiaoDichDoiNo(?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [accountNumberA, 'BBC', accountNumberB, 'BBC', amount, transType, note, payer, idTraNo])

    if (err_1) return res.status(422).send({
      success: false,
      message: err_1
    })
    console.log(result_1)

    const message = result_1[1][0] && result_1[1][0].message || ''
    const split = message.split(':')

    if (split[0] != 0) {
      return res.status(422).send({
        success: false,
        result_code: +split[0],
        message: split[1]
      })
    }

    console.log("-Chuyển tiền nội bộ thành công!!!")
    const io = req.app.get('socketio');

    io.emit('INTERNAL_TRANS', {usernameB, accountNumberA, accountNumberB, amount, note})

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
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username])

    console.log("GET OTP==", result_1[0])

    if (err_1) {
      console.log(err_1)
      return false
    }

    return result_1[0][0].ID_OTP
  }
 
  async sendOTP(req, res){
    const {username} = req.params
    const data = req.body

    const code = this.randomRange(100000, 999999) // random code
    const sendMail = this.sendMail(username, code, data)
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

  sendMail(email, code, formData) {
    const transporter = nodemailer.createTransport({ // config mail server
      service: 'Gmail',
      auth: {
        user: 'daochichteam@gmail.com',
        pass: 'anhsang1230'
      }
    });

    const time = moment().format('HH:mm:ss DD/MM/YYYY')

    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'Thanh Batmon',
      to: email,
      subject: 'Ngân hàng BBC',
      text: `Ngân hàng BBC thông báo,
      Tài khoản thanh toán: ${formData.accountNumberA} của bạn đã chuyển khoản cho tài khoản ${formData.accountNumberB} với số tiền ${formData.amount} vnđ, người trả phí là ${formData.payer === 'A' ? 'mình.' : 'bên nhận.'}
      Thời gian: ${time}
      Mã xác nhận là: ${code}
      Mã code sẽ tồn tại trong 5 phút
      Chân thành cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
      `,
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