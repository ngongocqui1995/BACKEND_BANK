const createError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports.verifyAccessToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'SANG_TOKEN', function (err, payload) {
      if (err) throw createError(403, err);

      next()
    })
  } else {
    throw createError(400, 'Token not found!');
  }
}

module.exports.verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.headers['x-refresh-token']

  if (!refreshToken) {
    throw createError(400, 'Refresh token not found!')
  }

  jwt.verify(refreshToken, 'SANG_TOKEN', function (err, payload) {
    if (err) throw createError(403, err);

    req.body = {
      main: refreshToken,
      payload
    }
    next();
  });

}
