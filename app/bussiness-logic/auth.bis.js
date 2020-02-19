const BaseBis = require('./base.bis')
const jwt = require('jsonwebtoken')
const rndToken = require('rand-token')

class AuthBis extends  BaseBis {
  constructor(mongoose) {
    super()
  }

  async authUser(userInfo) {
    let username = userInfo.Username
    let ClientID = userInfo.ID_TaiKhoan

    const token = jwt.sign({username}, 'SANG_TOKEN', {
      expiresIn: 10 * 60 * 1000 // 10 mins
    })

    const rfToken = jwt.sign({ClientID}, 'SANG_TOKEN', {
      expiresIn: 30 * 86400 * 1000 // 1 tháng
    })

    return {
      accessToken: token,
      refreshToken: rfToken,
      authenticated: true
    }
  }

}

module.exports = AuthBis