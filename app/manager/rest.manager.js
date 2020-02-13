const BaseManager = require(`${global.APP_MANAGER_PATH}/base.manager`)

class RestManager extends BaseManager {
  constructor(mongoose) {
    super()
  }

  responseWithError(res, err, code) {
    const sendData = {success: false}

    if (typeof err === 'object' && typeof err.message !== 'undefined') {
      sendData.message = err.message
    } else if (typeof err === 'string') {
      sendData.message = err
    }

    if (typeof code !== 'undefined') res.statusCode = code

  }

  responseWithSuccess(res, data, code) {
    let sendData = {success: true}

    if (typeof data === 'object') {
      sendData = Object.assign(data, sendData)// merge the objects
    } else if (typeof data === 'string') {
      sendData.message = data
    }

    if (typeof code !== 'undefined') res.statusCode = code

    if (Array.isArray(sendData)) {
      res.set('Access-Control-Expose-Headers', 'X-Total-Count')
      res.set('X-Total-Count', data.total || 0)
    }
    res.json(sendData)
  }
}

module.exports = RestManager
