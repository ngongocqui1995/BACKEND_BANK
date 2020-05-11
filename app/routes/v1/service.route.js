const router = require('express').Router()
const ServiceController = require(`${global.APP_CONTROLLER_PATH}/service.controller`)

const service = new ServiceController()
const {generateOpenPGP, encryptOpenPGP, decryptOpenPGP, compareApiSignature, signRSA, verifyRSA, decryptRSA, encryptRSA} = require('../../middleware/auth.mware')

router.post('/', compareApiSignature, service.getInfo)

// router.post('/wallet/topup', verifyRSA, service.topup)

// router.post('/wallet/trans/cashout', verifyRSA, service.cashout)

// router.post('/test/pgp/rsa/sign', signRSA, service.getInfo)

// other routes
module.exports = router