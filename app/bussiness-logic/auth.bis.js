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

    const token = jwt.sign({username, ClientID}, 'SANG_TOKEN', {
      expiresIn: 1 * 60 // 1 mins
    })

    const rfToken = jwt.sign({ClientID, username}, 'SANG_TOKEN', {
      expiresIn: 30 * 86400 // 1 tháng
    })

    return {
      accessToken: token,
      refreshToken: rfToken,
      authenticated: true
    }
  }

}

module.exports = AuthBis