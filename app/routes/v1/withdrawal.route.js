const router = require('express').Router()
const WithdrawalController = require(`${global.APP_CONTROLLER_PATH}/withdrawal.controller`)
const withdrawal = new WithdrawalController()
const { compareApiSignatureWithdrawal, signRSA, verifyRSA} = require('../../middleware/auth.mware')

router.post('/', compareApiSignatureWithdrawal, withdrawal.create)

router.post('/signRSA', signRSA)
// other routes
module.exports = router