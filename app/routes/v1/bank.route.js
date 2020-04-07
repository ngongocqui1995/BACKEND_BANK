const router = require('express').Router()
const BankController = require(`${global.APP_CONTROLLER_PATH}/bank.controller`)

const bank = new BankController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

router.get('/', verifyAccessToken, bank.getBankList)
router.post('/', verifyAccessToken, bank.create)

// other routes
module.exports = router