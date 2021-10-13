const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/book'
})
const {HotBook} = require('@modules/hotBook')
const {Book} = require('@modules/classic')
const {Favor} = require('@modules/favor')
const {Comment} = require('@modules/bookComment')
const {PositiveIntegerValidator, SearchValidator, ShortCommentValidator} = require('@validator')
const {Auth} = require('../../../middlewares/auth')

router.get('/hotBooks', async (ctx, next) =>{
  const books = await HotBook.getAll() 

  ctx.body = books
})

router.get('/:id/detail', async (ctx, next) =>{
  const v = await new PositiveIntegerValidator().validate(ctx)
  const book = await new Book().detail(v.get('path.id'))
  ctx.body = book
})

router.get('/search', async (ctx, next) =>{
  const v = await new SearchValidator().validate(ctx)

  const list = await Book.searchFromYuShu(v.get('query.q'),v.get('query.start'),v.get('query.count'))
  ctx.body = list
})

router.get('/favor/count', new Auth().m, async (ctx, next) =>{
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {count}
})

router.get('/:book_id/favor', new Auth().m, async (ctx, next) =>{
  const v = await new PositiveIntegerValidator().validate(ctx,{
    id: 'book_id'
  })
  const favor = await Favor.getBookFavor(v.get('path.book_id'), ctx.auth.uid)
  ctx.body = favor
})

router.post('/add/short_comment', new Auth().m, async (ctx, next) =>{
  const v = await new ShortCommentValidator().validate(ctx, {
    id: 'book_id'
  })
  Comment.addComment(v.get('body.book_id'), v.get('body.content'))

  throw new global.errs.Success()

})

router.get('/:book_id/short_comment', new Auth().m, async (ctx, next) =>{
  const v = await new PositiveIntegerValidator().validate(ctx,{
    id: 'book_id'
  })
  const book_id = v.get('path.book_id')
  const comments = await Comment.getShortComment(book_id, ctx.auth.uid)
  ctx.body = {
    comments,
    book_id
  }
})
module.exports = router