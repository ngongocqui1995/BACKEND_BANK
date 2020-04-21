const router = require('express').Router()
const DebtController = require(`${global.APP_CONTROLLER_PATH}/debt.controller`)

const debt = new DebtController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

router.post('/', verifyAccessToken, debt.create)
router.get('/:username', verifyAccessToken, debt.getOneByUser)
router.delete('/:id', verifyAccessToken, debt.removeDebt)

// other routes
module.exports = router