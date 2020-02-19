const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports.verifyAccessToken = (req, res, next) => {
  const accesstoken = req.headers['x-access-token'];
  const refreshtoken = req.headers['x-refresh-token'];
  if (accesstoken && refreshtoken) {
    try {
      let decode = jwt.verify(accesstoken, 'SANG_TOKEN')
      let decode_1 = jwt.verify(refreshtoken, 'SANG_TOKEN')
      req.accesstoken = decode
      req.refreshtoken = decode_1
      next();
    } catch (err) {
      throw createError(403, err);
    }
  } else {
    throw createError(401, 'NO_TOKEN');
  }
}