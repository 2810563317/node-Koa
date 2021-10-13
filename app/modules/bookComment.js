const {db} = require('../../core/db')
const {Sequelize, Model, Op} = require('sequelize')

class Comment extends Model {
  //添加构造函数，Sequelize不会返回没有设置默认值的字段
  // constructor(){
  //   super()
  // }
  static async addComment(bookId, content){
    const comment = await Comment.findOne({
      where:{
        book_id: bookId,
        content
      }
    })
    if(!comment){
      return await Comment.create({
        book_id: bookId,
        content,
        nums: 1
      })
    }else{
      return await comment.increment('nums', {
        by: 1
      })
    }
  }
  static async getShortComment(bookId){
    const comments = await Comment.findAll({
      where:{
        book_id: bookId
      }
    })
    return comments
  }

  // // JSON序列化，返回指定的数据
  // toJSON(){
  //   return {
  //     content: this.getDataValue('content'),
  //     nums: this.getDataValue('nums')
  //   }
  // }
}
Comment.prototype.exclude = ['created_at', 'deleted_at', 'updated_at']

Comment.init({
  content: Sequelize.STRING(12),
  nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  book_id: Sequelize.INTEGER
},{
  sequelize: db,
  tableName: 'comment'
})


module.exports = {
  Comment
}