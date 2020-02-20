const router = require('express').Router()
const UserController = require(`${global.APP_CONTROLLER_PATH}/user.controller`)
const user = new UserController()
const {verifyAccessToken} = require('../../middleware/auth.mware')

//CRUD
router.get('/info', user.info)

router.get('/', verifyAccessToken, user.getAll)

// other routes
module.exports = router