const router = require('express').Router()
const UserController = require(`${global.APP_CONTROLLER_PATH}/user.controller`)
const user = new UserController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

//CRUD
router.get('/info', verifyAccessToken, user.info)

router.get('/', verifyAccessToken, user.getAll)

router.post('/', verifyAccessToken, user.create)

router.post('/giaodich', verifyAccessToken, user.giaodich)

// other routes
module.exports = router