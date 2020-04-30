const router = require('express').Router()
const ToptupController = require(`${global.APP_CONTROLLER_PATH}/topup.controller`)
const topup = new ToptupController()
const {generateOpenPGP, encryptOpenPGP, decryptOpenPGP,
   compareApiSignature,compareApiSignatureTopup, signRSA, verifyRSA, decryptRSA, encryptRSA} = require('../../middleware/auth.mware')

router.post('/', compareApiSignatureTopup, topup.create)

router.post('/signRSA', signRSA)
// other routes
module.exports = router