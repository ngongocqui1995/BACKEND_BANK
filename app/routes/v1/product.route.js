/**
 * Created by sang.nguyen on 06/12/2019
 */

const router = require('express').Router()
const Controller = require(`${global.APP_CONTROLLER_PATH}/product.controller`)
const controller = new Controller()
const {verifyAccessToken} = require('../../middleware/auth.mware')
// CRUD
router.get('/', verifyAccessToken, controller.getAll)

// other routes

module.exports = router