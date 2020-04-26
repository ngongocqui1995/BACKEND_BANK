const router = require('express').Router()
const RecieverController = require(`${global.APP_CONTROLLER_PATH}/reciever.controller`)

const reciever = new RecieverController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

router.get('/:username', verifyAccessToken, reciever.getRecieverList)
router.post('/', verifyAccessToken, reciever.create)
router.put('/:username', verifyAccessToken, reciever.update)
// other routes
module.exports = router