class Data {
  
  constructor (type, data, id) {
    this.type = type
    this.data = data
    this._id = id
    this.date = Date.now()
  }

}

module.exports = Data;