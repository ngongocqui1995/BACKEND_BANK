/**
 * Created by crosp on 5/9/17.
 */
const BaseAutoBindedClass = require(`${global.APP_BASE_PACKAGE_PATH}/base-autobind`)
const RestManager = require(`${global.APP_MANAGER_PATH}/rest.manager`)
const { to } = require(`${global.APP_COMMON_PATH}`)

class BaseController extends BaseAutoBindedClass {
  constructor(mongoose) {
    super()
    if (new.target === BaseController) {
      throw new TypeError('Cannot construct BaseController instances directly')
    }
    this.restManager = new RestManager(mongoose)
  }

  ReE(res, err, code = 422) {
    return this.restManager.responseWithError(res, err, code)
  }

  ReS(res, data, code) {
    // console.log('BACKEND RESPONSE: ', JSON.stringify(data))
    return this.restManager.responseWithSuccess(res, data, code)
  }

  to(promise) {
    return to(promise)
  }

}
module.exports = BaseController
