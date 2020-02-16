const Ramda = require('ramda')
const { isArray } = require('util')

function isEmpty (data) {
    let kt = false

    if (Ramda.isNil(data) || Ramda.isEmpty(data)) {
        kt = true
    }

    return kt
}

function isEmail(data) {
    let pattern = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g)

    return pattern.test(data)
}

function getStateMessage(data){
    let state = false
    let message = ""

    if (isArray(data)) {
        if(data.length > 0 && data[0].message){
            let kq = data[0].message
    
            let split = kq.split(":")
            state = split[0] == 0 ? true : false
            message = split[1]
        }
    }

    return { state, message }
}

function getRowsPagination(data){
    let count = 0

    if(data.length > 0 && data[0].message){
        count = Number(data[0].message)
    }

    return { count }
}

module.exports = {
    isEmpty,
    isEmail,
    getStateMessage,
    getRowsPagination
}