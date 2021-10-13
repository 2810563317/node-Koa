require('module-alias/register')

const Koa = require('koa')

const path = require('path')

const parser = require('koa-bodyparser')

const static = require('koa-static')

const InitManager = require('./core/init')

const catchError = require('./middlewares/exception')

const app = new Koa()

//全局异常处理
app.use(catchError)
//中间件获取body参数
app.use(parser())
// 中间件使用静态资源
app.use(static(path.join(__dirname, './static')))

//使用nodeMon热更新


// 注册多个函数为中间件（中间件只在应用程序启动时实例化一次）
// 每个中间件强制加async await,保证中间件按洋葱模型顺序运行
/*
  async: 在函数前面加，将函数强制包装成promise
  await:
    1.求值 （表达式、promise）
    2.阻塞线程
*/

// app.use(async (ctx, next)=>{
//   console.log(1)
//   //下一个中间件函数
//   await next()
//   console.log(ctx.r)
//   console.log(2)
// })

/*
  api携带版本号
  1.路径
  2.查询参数
  3.header
*/

InitManager.initCore(app)
app.listen(3000)