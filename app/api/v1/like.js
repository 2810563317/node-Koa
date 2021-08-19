const Router = require('koa-router')
const {LikeValidator} = require('../../validators/validator')
const { Auth } = require('../../../middlewares/auth')
const { Favor } = require('../../modules/favor')

const router = new Router({
  prefix: '/v1/like' // 路由前缀
})

router.post('/',new Auth().m, async (ctx) => {
                                                    //别名
  const v = await new LikeValidator().validate(ctx, {id: 'art_id'})
  await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
  throw new global.errs.Success()
})

router.post('/cancel',new Auth().m, async (ctx) => {
const v = await new LikeValidator().validate(ctx, {id: 'art_id'})
await Favor.disLike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)

throw new global.errs.Success()
})

module.exports = router