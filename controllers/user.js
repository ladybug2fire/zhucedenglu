const UserModel = require("../modules/user");
const axios = require("axios");
const request = require('request');
const _ = require("lodash");
const MD5 = require("crypto-js/md5");
const moment = require("moment");
const ApiError = require('../util/ApiError')
class userController {

  static async authImage(ctx) {
    ctx.type = 'jpg';
    ctx.body = ctx.req.pipe(request(`http://cqhxgf.com/api/authImage?mobile=${ctx.query.mobile}`));
  }

  static async getCode(ctx) {
    const str2md5 =  moment().format("YYYYMMdhhmm").substring(0,11)+"telPhoneStr"+ ctx.query.mobile;
      const token = MD5(str2md5).toString();
    const res = await axios
      .get("http://cqhxgf.com/appI/api/getCode", {
        params: {
          phoneSystem: "Android",
          TelPhone: ctx.query.mobile,
          Code: ctx.query.code,
          version: "1.0.6",
          token
        }
      })
    console.log(res.data);
    if (_.get(res, "data.error_code") === 0) {
        ctx.body = _.get(res, "data");
    }else{
        throw new ApiError(500, _.get(res, 'data.message'));
    }
  }

  static async login(ctx) {
    const res = await axios
      .get("http://cqhxgf.com/appI/api/login", {
        params: {
          phoneSystem: "Android",
          TelPhone: ctx.query.mobile,
          Code: ctx.query.code,
          version: "1.0.6",
          PrjID: 0,
          isOpUser: 0
        }
      })
    if (_.get(res, "data.error_code") === 0) {
        ctx.body = _.get(res, "data");
    }else{
        throw new ApiError(500, _.get(res, 'data.message'));
    }
  }
}

module.exports = userController;
