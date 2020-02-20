const createError = require('http-errors');
const jwt = require('jsonwebtoken');

function verifyToken(token) {
  let decode = undefined
  try {
    decode = jwt.verify(token, 'SANG_TOKEN')
  }catch(err){
    // console.log(err)
  }

  return decode
}

module.exports.verifyAccessToken = (req, res, next) => {
  const accesstoken = req.headers['x-access-token'];
  const refreshtoken = req.headers['x-refresh-token'];
  if (accesstoken && refreshtoken) {
    req.accesstoken = verifyToken(accesstoken)
    req.refreshtoken = verifyToken(refreshtoken)
    next();
  } else {
    throw createError(401, 'NO_TOKEN');
  }
}