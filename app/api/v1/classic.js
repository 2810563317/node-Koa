const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
})
const { Flow } = require('@modules/flow')
const { Art } = require('@modules/art')
const { PositiveIntegerValidator, ClassicValidator } = require('@validator')

const { Auth } = require("../../../middlewares/auth")
const { Favor } = require('@modules/favor')
//  API token限制访问
//  new Auth().m ：自定义中间件验证token
router.get('/latest', new Auth().m, async (ctx, next) => {
  //4中传参方式
  /*
    const path = ctx.params
    const query = ctx.request.query
    const headers = ctx.request.haeder
    const body = ctx.request.body
  */
  // 获取最新一期数据 先排序再找最大
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })
  const art = await new Art(flow.art_id, flow.type).getData()

  // art.dataValues.index = flow.index
  art.setDataValue('index', flow.index)
  ctx.body = art

})
router.get('/:index/next', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index + 1
    }
  })
  if(!flow){
    throw new global.errs.NotFound() 
  }
  const art = await new Art(flow.art_id, flow.type).getData()
  const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeNext)
  // 在接口序列化，排除掉不需要的数据
  // art.exclude=['index']
  ctx.body = art
})

router.get('/:index/prev', new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: 'index'
  })
  const index = v.get('path.index')
  const flow = await Flow.findOne({
    where: {
      index: index - 1
    }
  })
  if(!flow){
    throw new global.errs.NotFound() 
  }
  const art = await new Art(flow.art_id, flow.type).getData()
  const likePrev = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likePrev)
  ctx.body = art
})

router.get('/:type/:id/favor', new Auth().m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))

  const artDetail =await new Art(id,type).getDetail(ctx.auth.uid);


  ctx.body = {
    fav_num:artDetail.art.fav_nums,
    likeStatus: artDetail.like_status
  }
})
router.get('/favor', new Auth().m, async (ctx) => {
  const uid = ctx.auth.uid;
  ctx.body = await Favor.getMyClassicFavors(uid)
})


router.get('/:type/:id', new Auth().m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx)
  const uid = ctx.auth.uid
  const id = v.get('path.id')
  const type = parseInt(v.get('path.type'))

  const artDetail =await new Art(id,type).getDetail(uid);

  artDetail.art.setDataValue('like_status', artDetail.like_status)

  ctx.body= artDetail.art
})
module.exports = router