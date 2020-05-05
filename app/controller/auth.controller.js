const BaseController = require('./base.controller')
const mongoose = require('mongoose')
const AuthBis = require('../bussiness-logic/auth.bis')
const { isEmail, isEmpty, getStateMessage, getRowsPagination } = require('../validator/validator')
const { queryDB } = require('../../config/dev/db_mysql')
const md5 = require('md5')
const to = require('await-to-js').default
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

class AuthController extends BaseController {
  constructor() {
    super(mongoose)
    this.authBis = new AuthBis(mongoose)
  }

  async getNewToken(req, res) {
    const refreshtoken = req.header["x-refresh-token"]
    const username = req.header["username"]
    // kiểm tra refreshtoken có tồn tại ko
    let sql_1 = "CALL proc_viewAuth_RefreshToken(?,?,?);";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, 
      ['', '', refreshtoken])
      
    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = result_1[0] ? { count: result_1[0].length } : { count: 0 }
    
    if(err_1) return res.status(422).send({
      success: false,
      message: err_1
    })

    if(numberRow.count === 0) return res.status(422).send({
      success: false,
      message: "Lấy thông tin thất bại!!!"
    })

    console.log("-Refreshtoken tồn tại và không hết hạn!!!")
    // lấy accesstoken
    const [err_2, auth] = await this.to(this.authBis.authUser({
      Username: username,
      ID_TaiKhoan: ''}))
    if(err_2) return res.status(422).send({
      success: false,
      message: err_2
    })

    console.log("-Lấy accesstoken thành công!!!")

    res.send({
        message: "Lấy token thành công!!!",
        accessToken: auth.accessToken,
        success: true
    })
  }

  async login(req, res) {
    let username = req.body.username
    let password = req.body.password

    if (!isEmail(username) || isEmpty(password)) {
      return res.status(422).send({
        success: false,
        message: "-Đăng nhập thất bại !!!"
      })
    }

    // kiểm tra đăng nhập thành công hay thất bại
    let hashPassword = md5(password)
    let sql = "CALL proc_DangNhap(?,?,@kq); select @kq as `message`;";
    let [err, [result, fields]] = await queryDB(sql, [username, hashPassword])

    let { state, message } = getStateMessage(result[result.length-1])
        
    if(err) return res.status(422).send({
      success: false,
      message: err
    })
    if(!state) return res.status(422).send({
      success: false,
      message: message
    })

    console.log("-Kiểm tra đăng nhập thành công!!!")

    // lấy thông tin user
    let sql_1 = "CALL proc_viewUser(?,?,?,?,?,?,?,@kq); select @kq as `message`;";
    let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [username, '', '', 1, 1, 'ID_TaiKhoan', 'tang'])
    
    let numberRow = { count: 0 }
    if (result_1.length > 0) numberRow = getRowsPagination(result_1[result_1.length-1])

    if(err_1) return res.status(422).send({
      success: false,
      message: err_1
    })
    if(numberRow.count === 0) return res.status(422).send({
      success: false,
      message: "Đăng nhập thất bại !!!"
    })

    console.log("-Lấy thông tin user thành công!!!")

    let user = result_1[0] ? result_1[0][0] : {}

    // lấy accesstoken và refreshToken
    const [err_2, auth] = await this.to(this.authBis.authUser(user))
    if(err_2) return res.status(422).send({
      success: false,
      message: err_2
    })

    console.log("-Lấy accesstoken và refreshToken thành công!!!")

    // kiểm tra refreshtoken có tồn tại ko
    let sql_4 = "CALL proc_viewAuth_RefreshToken(?,?,?);";
    let [err_4, [result_4, fields_4]] = await queryDB(sql_4, [username, '', ''])
    
    let numberRow_4 = { count: 0, row: [] }
    if (result_4.length > 0) numberRow_4 = result_4[0] ? { 
      count: result_4[0].length,
      row: result_4[0]
    } : { 
      count: 0, 
      row: [] 
    }

    if(err_4) return res.status(422).send({
      success: false,
      message: err_4
    })

    console.log("NUM=", numberRow_4.row[0])

    let refreshToken = numberRow_4.row[0] ? numberRow_4.row[0].Refresh_token : ""
    if(numberRow_4.row[0].Refresh_token === '') {
      // lưu refreshToken vào db
      let sql_3 = "CALL proc_ThemAuth_RefreshToken(?,?,?,?,?,@kq); select @kq as `message`;";
      let [err_3, [result_3, fields_3]] = await queryDB(sql_3, [username, user.ID_TaiKhoan, auth.refreshToken, 'thang', '1'])

      if(err_3) return res.status(422).send({
        success: false,
        message: err_3
      })

      console.log("-Thêm refreshToken vào database thành công!!!")
    } else {
      auth.refreshToken = numberRow_4.row[0] ? numberRow_4.row[0].Refresh_token : ""
    }
    
    return res.send({
      ...auth,
      username: user.Username,
      Loai: user.Loai,
      success: true,
      message: message
    })
  }

  async changePass(req, res) {
    const { username, password, oldPassword } = req.body

    let hashPassword = md5(password)
    let hashOldPassword = md5(oldPassword)
    let sql = "CALL proc_DoiPassTaiKhoan(?,?,?,@kq); select @kq as `message`;";
    let [err, [result, fields]] = await queryDB(sql, [username, hashPassword, hashOldPassword])

    let { state, message } = getStateMessage(result[result.length - 1])

    if(err) return res.status(422).send({
      success: false,
      message: err
    })

    if (!state) return res.status(422).send({
      success: false,
      message: message
    })

    return res.send({
      success: true,
      message: 'Đổi mật khẩu thành công!'
    })
  }

  async resetPassword(req, res) {
    const { username, newPassword, OTP } = req.body
    const otp = await this.getOTP(username)

    if(otp.length > 6) {
      return res.status(422).send({
        success: false,
        message: "Mã OTP đã hết thời gian!"
      })
    }

    if(otp != OTP) {
      return res.status(422).send({
        success: false,
        message: "Mã xác nhận OTP không đúng!"
      })
    }

    let hashPassword = md5(newPassword)
    let sql = "CALL proc_ResetPassTaiKhoan(?,?,@kq); select @kq as `message`;";
    let [err, [result, fields]] = await queryDB(sql, [username, hashPassword])

    let { state, message } = getStateMessage(result[result.length - 1])

    if(err) return res.status(422).send({
      success: false,
      message: err
    })

    if (!state) return res.status(422).send({
      success: false,
      message: message
    })

    return res.send({
      success: true,
      message: 'Đổi mật khẩu thành công!'
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
    const code = this.randomRange(100000, 999999) // random code

    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'Thanh Batmon',
      to: username,
      subject: 'Ngân hàng BBC',
      text: `Bạn đã yêu cầu reset mật khẩu, 
        Mã xác thực là: ${code}
        Vui lòng nhập mã này và hoàn tất quá trình reset mật khẩu!
      `,
    }
    const sendMail = this.sendMail(code, mainOptions)
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

  sendMail(code, mainOptions) {
    const transporter = nodemailer.createTransport({ // config mail server
      service: 'Gmail',
      auth: {
        user: 'daochichteam@gmail.com',
        pass: 'anhsang1230'
      }
    });

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

module.exports = AuthController