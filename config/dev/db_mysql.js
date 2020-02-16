const mysql = require('mysql2');

let config = {
    host: "johnny.heliohost.org",
    user: "thongbao",
    password: "8239198tamquysang",
    database: "thongbao_test",
    port: 3306,
    multipleStatements: true,
    connectionLimit: 1000,
    waitForConnections: true,
    queueLimit: 0
}

const pool = mysql.createPool(config);
const promisePool = pool.promise();
const to = require('await-to-js')

function checkConnectDB() {
    promisePool.query("SELECT 1")
    .then( ([rows,fields]) => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log(err)
        console.log('Could not connect to the database. Exiting now...')
        process.exit()
    })
}

async function queryDB(sql, values){
    try {
        [result, fields] = await promisePool.query(sql, values)
        return [null, [result, fields]]
    } catch (err) {
        return [err, [[], []]]
    }
}

module.exports = {
    promisePool,
    queryDB,
    checkConnectDB
}