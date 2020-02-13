/**
 * Created by sang.nguyen on 06/12/2019
 */

const { to } = require('await-to-js')
const pe = require('parse-error')

module.exports.to = async promise => {
  const [err, res] = await to(promise)
  if (err) return [pe(err)]

  return [null, res]
}