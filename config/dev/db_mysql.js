const mysql = require('mysql2');

let config = {
    host: "db4free.net",
    user: "thongbao",
    password: "8239198tamquysang",
    database: "thongbao_test",
    port: 3306,
    multipleStatements: true,
    connectionLimit: 1000,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 25000
}

const pool = mysql.createPool(config);
const promisePool = pool.promise();
const to = require('await-to-js').default

async function checkConnectDB() {
    let [err, result] = await to(promisePool.query("SELECT 1"))
    if (err) {
        console.log(err)
        console.log('Could not connect to the database. Exiting now...')
        process.exit()
    }

    console.log("Successfully connected to the database");
}

async function queryDB(sql, values){
    let [err, [result, fields]] = await to(promisePool.query(sql, values))
    return [err, [result, fields]]
}

module.exports = {
    promisePool,
    queryDB,
    checkConnectDB
}