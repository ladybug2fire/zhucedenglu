const UserModel = require("../modules/user");
const UserSchema = require("../schema/user.joi")
const axios = require("axios");
const request = require("request");
const _ = require("lodash");
const MD5 = require("crypto-js/md5");
const moment = require("moment");
const ApiError = require("../util/ApiError");
const Joi = require('@hapi/joi');
class userController {
  /**
   * 创建用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async create(ctx) {
    //接收客服端
    let req = ctx.request.body;
    if (req.username && req.password) {
      try {
        const ret = await UserModel.createUser(req);
        const data = await UserModel.getUserDetail(ret.id);

        ctx.response.status = 200;
        ctx.body = {
          code: 200,
          msg: "创建用户成功",
          data
        };
      } catch (err) {
        ctx.response.status = 412;
        ctx.body = {
          code: 412,
          msg: "创建用户失败",
          data: err
        };
      }
    } else {
      throw new ApiError(416, "参数不齐全");
    }
  }

  /**
   * 获取用户详情
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async detail(ctx) {
    let id = ctx.params.id;
    if (id) {
      try {
        let data = await UserModel.getUserDetail(id);
        ctx.response.status = 200;
        ctx.body = {
          code: 200,
          msg: "查询成功",
          data
        };
      } catch (err) {
        ctx.response.status = 412;
        ctx.body = {
          code: 412,
          msg: "查询失败",
          data
        };
      }
    } else {
      ctx.response.status = 416;
      ctx.body = {
        code: 416,
        msg: "文章ID必须传"
      };
    }
  }

  static async authImage(ctx) {
    ctx.type = "jpg";
    ctx.body = ctx.req.pipe(
      request(`http://cqhxgf.com/api/authImage?mobile=${ctx.query.mobile}`)
    );
  }

  static async getCode(ctx) {
    const str2md5 =
      moment()
        .format("YYYYMMdhhmm")
        .substring(0, 11) +
      "telPhoneStr" +
      ctx.query.mobile;
    const token = MD5(str2md5).toString();
    const res = await axios.get("http://cqhxgf.com/appI/api/getCode", {
      params: {
        phoneSystem: "Android",
        TelPhone: ctx.query.mobile,
        Code: ctx.query.code,
        version: "1.0.6",
        token
      }
    });
    if (_.get(res, "data.error_code") == 0) {
      ctx.body = _.get(res, "data");
    } else {
      throw new ApiError(500, _.get(res, "data.message"));
    }
  }

  /**
   * 登录第三方，获取额外信息注册到本地
   */
  static externalLogin(query) {
    return axios.get("http://cqhxgf.com/appI/api/login", {
      params: {
        phoneSystem: "Android",
        TelPhone: query.TelPhone,
        Code: query.code,
        version: "1.0.6",
        PrjID: 0,
        isOpUser: 0
      }
    });
  }

  static newLogin(query) {
    return axios.get("http://china-qzxy.cn/appI/api/newLogin", {
      params: {
        passWord: query.passWord,
        TelPhone: query.TelPhone,
        isOpUser: 0,
        status: 1,
        phoneSystem: "Android",
        version: "4.2.2"
      }
    });
  }
  // 登录
  static async login(ctx) {
    const user = await UserModel.getUser(ctx.query.UserName);
    if (user.Password === ctx.query.Password) {
      ctx.response.status = 200;
      ctx.body = {
        error_code: 0,
        message: "登录成功"
      };
    } else {
      throw new ApiError(300, "用户名或密码错误");
    }
  }

  static async register(ctx) {
    let req = ctx.request.body;
    const result = Joi.validate(req, UserSchema)
    console.log(result, req)
    if(result.error){
        throw new ApiError(416, result.error)
    }
    if (req.UserName && req.Password) {
      let thridVerify = null;
      let user = _.pick(req, ['UserName', 'Password', 'TelPhone', 'UserType']);
      // 汇优
      if (req.UserType == 1) {
        thridVerify = await userController.externalLogin({
          TelPhone: req.TelPhone,
          code: req.code
        });
        if (_.get(thridVerify, "data.error_code") == 0) {
            user = _.assign(user, {
                loginCode: _.get(thridVerify, 'data.data.loginCode')
            }) 
        } else {
          throw new ApiError(500, _.get(thridVerify, 'data.message'));
        }
      }
      // 趣智
      else if (req.UserType == 0) {
        const qxzyPasswd = MD5(req.Password).toString().substr(-10, 10);
        thridVerify = await userController.newLogin({
          TelPhone: req.TelPhone,
          passWord: qxzyPasswd, //
        });
        if (_.get(thridVerify, "data.error_code") == 0) {
           user = _.assign(user, {
            qxzyPasswd 
           })
        } else {
          throw new ApiError(500, _.get(thridVerify, 'data.message'));
        }
      } else {
        throw new ApiError(500, "UserType 错误");
      }
      
      try {
          const ret = await UserModel.createUser(user);
      } catch (error) {
          throw new ApiError(500, '保存出错')
      }

      ctx.response.status = 200;
      ctx.body = {
        code: 200,
        msg: "注册成功"
      };
    }else{
        throw new ApiError(416, '参数不齐全')
    }
  }
}

module.exports = userController;
