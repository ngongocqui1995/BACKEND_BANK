const mysql = require('mysql2');

let config = {
    host: "johnny.heliohost.org",
    user: "thongbao",
    password: "8239198tamquysang",
    database: "thongbao_test",
    port: 3306
}

const pool = mysql.createPool(config);
const promisePool = pool.promise();

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
    let [err,data] = await to(promisePool.query(sql, values))

    let result = [], fields = []
    if (data) [result, fields] = data

    return [err, [result, fields]]
}

module.exports = {
    promisePool,
    queryDB,
    checkConnectDB
}