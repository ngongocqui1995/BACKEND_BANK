const BaseController = require('./base.controller')
const { queryDB } = require('../../config/dev/db_mysql')
const { getRowsPagination, isEmpty, getStateMessage } = require('../validator/validator')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const moment =  require('moment')
const private_Key = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
`

class TransactionController extends BaseController {
  constructor() {
    super(mongoose)
  }

  async getAll(req, res) {
    const {bankA, bankB, startDay, endDay} = req.query
    console.log(req.query)

    let sql_1 = "CALL proc_viewGiaoDich(?,?,?,?,?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, ['', '', 1, 1000, 'ThoiGian', 'giam', bankA, bankB, startDay, endDay, ''])

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

  signRSA(data){
    const key = new NodeRSA();
    key.importKey(private_key_rsa)
  
    const sign = key.sign(JSON.stringify(data), 'base64', 'utf8');
    
    return sign
  }

  callCashIn() {
    
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