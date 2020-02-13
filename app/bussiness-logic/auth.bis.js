const BaseBis = require('./base.bis')
const jwt = require('jsonwebtoken')
const rndToken = require('rand-token')

class AuthBis extends  BaseBis {
  constructor(mongoose) {
    super()
  }

  async authUser(userInfo) {
    // check database
    const payload = {
      userId: "123test"
    }

    const token = jwt.sign(payload, 'SANG_TOKEN', {
      expiresIn: 10 * 60 * 1000 // 10 mins
    })

    const rfToken = rndToken.generate(80)

    return {
      accessToken: token,
      refreshToken: rfToken,
      authenticated: true
    }
  }

}

module.exports = AuthBis