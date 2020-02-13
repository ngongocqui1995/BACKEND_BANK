const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports.verifyAccessToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'SANG_TOKEN', function (err, payload) {
      if (err) throw createError(403, err);

      console.log(payload);
      next();
    });
  } else {
    throw createError(401, 'NO_TOKEN');
  }
}