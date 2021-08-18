const {HttpException} = require('../core/http-exception')

// 全局异常处理
const catchError = async (ctx, next) => {
  try{
    await next()
  }catch(error){
    // 开发环境 直接抛出异常
    const isHttpException = error instanceof HttpException
    const isDev = global.config.environment === 'dev'
    if(isDev && !isHttpException){
      throw error
    }

    // 生产环境 返回错误信息
    //已知异常
    if(isHttpException){
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request:`${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    }
    //未知异常
    else{
      ctx.body = {
        msg: 'we made a mistake',
        error_code: 999,
        request:`${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
     }
  }
}

module.exports = catchError