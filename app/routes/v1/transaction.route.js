const router = require('express').Router()
const TransactionController = require(`${global.APP_CONTROLLER_PATH}/transaction.controller`)

const trans = new TransactionController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

router.get('/', verifyAccessToken, trans.getAll)

router.get('/:username', verifyAccessToken, trans.getOne)

router.post('/internal', verifyAccessToken, trans.internalTrans)
// other routes
module.exports = router