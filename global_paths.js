/**
 * Created by sang.nguyen on 06/12/2019
 */

const path = require('path')

// Root path
global.APP_ROOT_PATH = `${__dirname}/app`
global.APP_COMMON_PATH = `${__dirname}/utils`

// Set global config
global.APP_ROUTE_PATH = `${global.APP_ROOT_PATH}/routes`
global.APP_CONTROLLER_PATH = `${global.APP_ROOT_PATH}/controller`
global.APP_MIDDLEWARE_PATH = `${global.APP_ROOT_PATH}/middleware`
global.APP_MANAGER_PATH = `${global.APP_ROOT_PATH}/manager`
global.APP_BASE_PACKAGE_PATH = `${global.APP_ROOT_PATH}/base`
// related resources

/***************************** EXAMPLE **********************************************
 * global.CORE_LOGIC_PATH = path.join(__dirname, '..', 'saleman-core/business-logic')
 */
