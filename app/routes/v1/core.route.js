const router = require('express').Router()
const CoreController = require(`${global.APP_CONTROLLER_PATH}/core.controller`)

const core = new CoreController()
const {generateOpenPGP, encryptOpenPGP, decryptOpenPGP,
  compareApiSignature, signRSA, verifyRSA, decryptRSA, encryptRSA,
  verifyAccessToken} = require('../../middleware/auth.mware')

router.post('/', verifyAccessToken, core.getInfo)

// other routes
module.exports = router