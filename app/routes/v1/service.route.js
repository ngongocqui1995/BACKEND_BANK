const router = require('express').Router()
const ServiceController = require(`${global.APP_CONTROLLER_PATH}/service.controller`)

const service = new ServiceController()
const {generateOpenPGP, encryptOpenPGP, decryptOpenPGP} = require('../../middleware/auth.mware')

router.post('/', generateOpenPGP, service.getInfo)

router.post('/encrypt', encryptOpenPGP, service.getInfo)

router.post('/test/decrypt', decryptOpenPGP, service.getInfo)

// other routes
module.exports = router