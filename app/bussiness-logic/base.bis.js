
const { TE, to } = require(`${global.APP_COMMON_PATH}`)

class BaseBis {
  constructor() {
    if (new.target === BaseBis) {
      throw new TypeError('Cannot construct BaseBis instances directly')
    }
    this.queryFilter = () => ({})
  }

  TE(error) {
    return TE(error)
  }

  to(promise) {
    return to(promise)
  }

  setQueryFilter(filter) {
    if (filter.q) {
      const query = filter.q
      delete filter.q
      filter = { $and: [filter, this.queryFilter(query)] }
    }
    return filter
  }

}

module.exports = BaseBis
