const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')


class Auth{
  constructor(level){
    // API权限级别
    this.level = level || 1
    // 分级权限数字
    Auth.USER = 8
    Auth.ADMIN = 16
    Auth.SUPER_ADMIN = 32
  }
  get m(){
    return async (ctx, next) =>{

      // token检测
      // 前端传递令牌（header、body）

      //解码http传过来的token
      const userToken = basicAuth(ctx.req)

      let errMsg = 'token不合法'
      if(!userToken || !userToken.name){
        throw new global.errs.Forbbiden(errMsg)
      }
      try{
        //   校验令牌
        var decode = jwt.verify(userToken.name, global.config.security.secretKey)
      } catch(error){
        
        // 1. 过期 2.不合法
        if(error.name === 'TokenExpiredError'){
          errMsg = 'token已过期'
        }
        throw new global.errs.Forbbiden(errMsg)

      }

      // token 和 API 权限比较
      if(decode.scope < this.level){
        errMsg = '权限不足'
        throw new global.errs.Forbbiden(errMsg)
      }

      // 将生成令牌时的uid、scope存到ctx
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      await next()

    }
  }

  static verifyToken(token){
    try{
      jwt.verify(token, global.config.security.secretKey)
      return true
    }catch(error){
      return false
    }
  }
}

module.exports={
  Auth
}