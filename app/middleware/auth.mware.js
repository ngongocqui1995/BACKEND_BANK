const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const openpgp = require('openpgp');
const NodeRSA = require('node-rsa');
const sha512 = require('js-sha512').sha512;
const { queryDB } = require('../../config/dev/db_mysql')
const moment = require('moment')

const public_key = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

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
GSVHpP47exAj
=uP0G
-----END PGP PUBLIC KEY BLOCK-----`;

const private_key = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.10.1
Comment: https://openpgpjs.org

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
ljRGkfLSHUpjxee7K67ScLBmuRklR6T+O3sQIw==
=9e+d
-----END PGP PRIVATE KEY BLOCK-----`;

const public_key_rsa = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA39+Q3k9fD1sjdDxwMsEr
3uWNgSgjB3llMS109saYiv7eC1KB0fUZe7jF1PxHNtcmstjjTs90pi60ffKGLkOF
u0ohWcY/3LNhHL8zBack3kP/UqJcRmFKx/kQV4DzlbdhdF6niqbTnPzUwLtkeZVq
ruPIy7lDSDpoq9U7FfvuhzgZLlK5+VxeomVwGcSkRMennNuV84jMQgsftGnAkRLd
OitUFaImaYRjdVHAe+j+0Oh+zCQywvR1eh68gFmUnz0Q6YLmFxeQTHDO1PXODl/z
x/5W+LwyTwy7J0vi4WLKhsoa4FBQxnpQworvZYOmG2JoNXpzMJulowHy252HZNge
RL8RSMO1oOhpomRjvzgj72NqIZo44yEpS/D5d/raazLuvPPdqntUPl5XvzzouFME
SvY82pFvGtpwUUFpjkPgBoOYt8HoWs6W7a6A3tNy2n4IaSTQ74fNofyFzVAPJHT+
x4zcMOPgg0IoZ9Vfm4K2jsXj8M6uhWDvRyt0ZRMV6YITzP/xLGx+oedJqPjHK0Mq
0JtHfKRq1m9H0woZ0D6UXJEcgMSA0BrSlDeWqwr4/sGjPLTJI0DXyBgnIVEjymPc
SGN68s+8GzBKazvrcCHwIVwDjHMxy1QIrNY5ec/CpvwkbKRCxaZRk+Pxg3kQDQvt
Sz+EqR83KGyJwqtHDCYUiHECAwEAAQ==
-----END PUBLIC KEY-----`

const private_key_rsa = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----`

const passphrase = "sangsang";

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

module.exports.generateOpenPGP = async (req, res, next) => {
  const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
    userIds: [{ name: 'Nguyen Sang', email: 'nguyentansang1996@gmail.com' }], // you can pass multiple user IDs
    rsaBits: 4096,                                           // ECC curve name
    passphrase: 'sangsang'           // protects the private key
  });

  console.log(publicKeyArmored)
  console.log(privateKeyArmored)

  res.send({
    public_key: publicKeyArmored,
    private_key: privateKeyArmored
  })
}

module.exports.signOpenPGP = async (req, res, next) => {
  const { payload } = req.body
  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText(JSON.stringify(payload)), // CleartextMessage or Message object
    privateKeys: [private_key]                             // for signing
  });
  console.log(cleartext); // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
}

module.exports.verifyOpenPGP = async (message, signature, pub_key) => {
  const { signatures } = await openpgp.verify({
    message: await openpgp.cleartext.readArmored(message),           // parse armored message
    publicKeys: (await openpgp.key.readArmored(pub_key)).keys // for verification
  });
  const { valid } = verified.signatures[0];
  if (valid) {
    console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
  } else {
    throw new Error('signature could not be verified');
  }
}

module.exports.encryptOpenPGP = async (req, res, next) => {
  const { payload } = req.body
  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(payload)),                 // input as Message object
    publicKeys: (await openpgp.key.readArmored(public_key)).keys, // for encryption
  });
  console.log(encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
  res.send({ data: encrypted })
}

module.exports.decryptOpenPGP = async (req, res, next) => {
  const { payload } = req.body

  const { keys: [privateKey] } = await openpgp.key.readArmored(private_key);
  await privateKey.decrypt(passphrase); 

  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.message.readArmored(payload),              // parse armored message
    privateKeys: [privateKey]                                        // for decryption
  });
  console.log(decrypted); // 'Hello, World!'
  res.send({ data: decrypted })
}

///////////////////////////// RSA /////////////////////////////////////////////////////////////
module.exports.signRSA = (req, res, next) => {
  const {rsa_signature} = req.body

  const key = new NodeRSA();
  key.importKey(private_key_rsa)

  const sign = key.sign(JSON.stringify(rsa_signature), 'base64', 'utf8');
  
  console.log(sign)
  res.send({data: sign})
}

const verifyRSA = (rsa_message, rsa_signature, Pub_Key) => {
  const key = new NodeRSA();
  console.log(rsa_message)
  key.importKey(Pub_Key)
  const verify = key.verify(JSON.stringify(rsa_message), rsa_signature, 'utf8', 'base64');

  if(verify) {
    return true
  }

  return false
}

module.exports.encryptRSA = (req, res, next) => {
  const {rsa_signature} = req.body

  const key = new NodeRSA();
  key.importKey(private_key_rsa)
  
  const encryptData = key.encryptPrivate(rsa_signature, 'base64', 'utf8');
  console.log(encryptData)
  res.send({data: encryptData})
}

module.exports.decryptRSA = (req, res, next) => {
  const {rsa_signature} = req.body

  const key = new NodeRSA();
  key.importKey(public_key_rsa)
  
  const decryptData = key.decryptPublic(rsa_signature, 'utf8');
  console.log(decryptData)
  res.send({data: decryptData})
}
/**
 * TRUY VẤN THÔNG TIN
 */
module.exports.compareApiSignature = async (req, res, next) => {
  //  kiểm tra agent code (là tên ngan hàng)
  const agent_code_client = req.headers.agent_code
  const check_agent_code = await getBankByAgentCode(agent_code_client)
  console.log(check_agent_code)

  if(!check_agent_code) {
    return res.status(406).json({
      result_code: 1,
      message_code: "INVALID_AGENT_CODE",
      message_text: 'Trường agent_code không hợp lệ!'
    })
  }

  const url = 'api/v1/bbc/truyvanthongtin'
  const agentSecretKey = check_agent_code.Key_Auth
  const body = JSON.stringify(req.body)
  const ts = +req.headers.ts
  // kiểm tra thời gian request
  const currDate = moment().valueOf()
  const time = currDate - ts
  if(time > 180000) {
    return res.status(406).json({
      result_code: 1,
      message_code: "REQUEST_TIMOUT",
      message_text: "Yêu cầu đã quá hạn cho phép!"
    })
  }

  // kiễm tra gói tin có chỉnh sửa chưa
  const clientSig = req.headers.api_signature
  const joinData = [url, ts, body, agentSecretKey].join("|")
  const serverSig = sha512(joinData)
  
  if(clientSig === serverSig) {
    next()
  } else {
    return res.status(406).json({
      result_code: 1,
      message_code: "INVALID_SIGNATURE",
      message_text: "Trường api_signature không hợp lệ!"
    })
  }
}
/**
 * NAP TIỀN
 */
module.exports.compareApiSignatureTopup = async (req, res, next) => {
  //  kiểm tra agent code (là tên ngan hàng)
  const agent_code_client = req.headers.agent_code
  const check_agent_code = await getBankByAgentCode(agent_code_client)
  console.log(check_agent_code)

  if(!check_agent_code) {
    return res.status(406).json({
      result_code: 1,
      message_code: "INVALID_AGENT_CODE",
      message_text: 'Trường agent_code không hợp lệ!'
    })
  }

  const url = 'api/v1/naptien'
  const agentSecretKey = check_agent_code.Key_Auth
  const body = JSON.stringify(req.body)
  const ts = +req.headers.ts
  // kiểm tra thời gian request
  const currDate = moment().valueOf()
  console.log(currDate)
  if(currDate - ts > 180000) {
    return res.status(406).json({
      result_code: 1,
      message_code: "REQUEST_TIMOUT",
      message_text: "Yêu cầu đã quá hạn cho phép!"
    })
  }

  // kiễm tra gói tin có chỉnh sửa chưa
  const clientSig = req.headers.api_signature
  const joinData = [url, ts, body, agentSecretKey].join("|")
  const serverSig = sha512(joinData)
  
  if(clientSig !== serverSig) {
    return res.status(406).json({
      result_code: 1,
      message_code: "INVALID_SIGNATURE",
      message_text: "Trường api_signature không hợp lệ!"
    })
  }

  // kiễm tra verify
  const algorithm = check_agent_code.Type_Auth
  console.log(algorithm)
  if (algorithm === 'RSA') {
    const verified = verifyRSA(req.body.key_message, req.body.key_signature, check_agent_code.Pub_Key)
    console.log("SIGNATURE RSA=", verified)
    if(verified) {
      next()
    } else {
      return res.status(406).json({
        result_code: 1,
        message_code: "VERIFY FAIL",
        message_text: "Chữ ký không hợp lệ!"
      })
    }
  } else if (algorithm === 'PGP') {
    // PGP
    const verified = this.verifyOpenPGP(req.body.key_message, req.body.key_signature, check_agent_code.Pub_Key)
    console.log("SIGNATURE PGP=", verified)
    if(verified) {
      next()
    } else {
      return res.status(406).json({
        result_code: 1,
        message_code: "VERIFY FAIL",
        message_text: "Chữ ký không hợp lệ!"
      })
    }
  }
}

/**
 * trừ TIỀN
 */
module.exports.compareApiSignatureWithdrawal = async (req, res, next) => {
  //  kiểm tra agent code (là tên ngan hàng)
  const agent_code_client = req.headers.agent_code
  const check_agent_code = await getBankByAgentCode(agent_code_client)
  console.log(check_agent_code)

  if(!check_agent_code) {
    return res.status(406).json({
      result_code: 1,
      message_code: "INVALID_AGENT_CODE",
      message_text: 'Trường agent_code không hợp lệ!'
    })
  }

  const url = 'api/v1/trutien'
  const agentSecretKey = check_agent_code.Key_Auth
  const body = JSON.stringify(req.body)
  const ts = +req.headers.ts
  // kiểm tra thời gian request
  const currDate = moment().valueOf()
  console.log(currDate)
  if(currDate - ts > 180000) {
    return res.status(406).json({
      result_code: 1,
      message_code: "REQUEST_TIMOUT",
      message_text: "Yêu cầu đã quá hạn cho phép!"
    })
  }

  // kiễm tra gói tin có chỉnh sửa chưa
  const clientSig = req.headers.api_signature
  const joinData = [url, ts, body, agentSecretKey].join("|")
  const serverSig = sha512(joinData)
  
  if(clientSig !== serverSig) {
    return res.status(406).json({
      result_code: 1,
      message_code: "INVALID_SIGNATURE",
      message_text: "Trường api_signature không hợp lệ!"
    })
  }

  // kiễm tra verify
  const algorithm = check_agent_code.Type_Auth
  console.log(algorithm)
  if (algorithm === 'RSA') {
    const verified = verifyRSA(req.body.key_message, req.body.key_signature, check_agent_code.Pub_Key)
    console.log("SIGNATURE RSA=", verified)
    if(verified) {
      next()
    } else {
      return res.status(406).json({
        result_code: 1,
        message_code: "VERIFY FAIL",
        message_text: "Chữ ký không hợp lệ!"
      })
    }
  } else if (algorithm === 'PGP') {
    // PGP
    const verified = this.verifyOpenPGP(req.body.key_message, req.body.key_signature, check_agent_code.Pub_Key)
    console.log("SIGNATURE PGP=", verified)
    if(verified) {
      next()
    } else {
      return res.status(406).json({
        result_code: 1,
        message_code: "VERIFY FAIL",
        message_text: "Chữ ký không hợp lệ!"
      })
    }
  }
}



/**
 * kiểm tra ngan hàng đó có liên kết hay chưa
 *  */ 
const getBankByAgentCode = async (agent_code) => {
  
  let sql_1 = "CALL proc_viewKeyNH(?);";
  let [err_1, [result_1, fields_1]] = await queryDB(sql_1, [agent_code])

  if (err_1) return res.status(422).send({
    success: false,
    message: err_1
  })

  return result_1[0][0]
}