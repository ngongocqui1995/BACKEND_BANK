const router = require('express').Router()
const TransactionController = require(`${global.APP_CONTROLLER_PATH}/transaction.controller`)

const trans = new TransactionController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

router.get('/', verifyAccessToken, trans.getAll)

router.get('/:username', verifyAccessToken, trans.getOne)

router.post('/internal', verifyAccessToken, trans.internalTrans)

//router.post('/bbc/external', verifyAccessToken, trans.externalTrans)

router.post('/otp/:username', verifyAccessToken, trans.sendOTP)

// other routes
module.exports = router