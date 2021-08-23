const Router = require('koa-router')
const {RegisterValidator} = require('@validator')
const {User} = require('@modules/user')

const router = new Router({
  prefix: '/v1/user' // 路由前缀
})

router.post('/register', async (ctx) => {
  // 接收参数 ，linValidate 校验
  const v = await new RegisterValidator().validate(ctx)

  const user = {
    email: v.get('body.email'),
    password: v.get('body.password2'),
    nickname: v.get('body.nickname'),
  }

  //创建数据至数据库
  await User.create(user)

  throw new global.errs.Success()
})

module.exports = router