const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/book'
})
const {HotBook} = require('@modules/hotBook')
const {Book} = require('@modules/classic')
const {PositiveIntegerValidator} = require('@validator')


router.get('/hotBooks', async (ctx, next) =>{
  const books = await HotBook.getAll() 

  ctx.body = books
})

router.get('/:id/detail', async (ctx, next) =>{
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = await new Book(v.get('path.id')).detail()
  ctx.body = book
})
module.exports = router