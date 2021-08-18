const requireDirectory= require('require-directory')
const Router = require('koa-router')

//初始化管理器
class InitManager {
  static initCore(app){
    //入口方法
    InitManager.app = app
    InitManager.initLoadRouters()
    InitManager.laodHttpException()
    InitManager.loadConfig()

  }
  static loadConfig(path = ''){
    //设置当前环境
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }
  static initLoadRouters() {
    // process.cwd() 获取根路径
    const apiDirectory = `${process.cwd()}/app/api`
    //导入api文件夹里面所有的路由
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })
    //导出的文件是路由，注册路由
    function whenLoadModule(obj) {
      if(obj instanceof Router ){
          InitManager.app.use(obj.routes())
      }
  }
  }
  // 参数校验
  static laodHttpException(){
    const errors = require('./http-exception')
    global.errs = errors
  }
}

module.exports = InitManager