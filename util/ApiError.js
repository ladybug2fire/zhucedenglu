class ApiError extends Error {
    constructor (code, msg) {
      super(msg)
      this.code = code
      this.msg = msg
      this.name = 'ApiError'
    }
  }
  
module.exports = ApiError