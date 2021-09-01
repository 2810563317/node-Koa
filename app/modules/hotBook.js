const {db} = require('../../core/db')
const {Sequelize, Model, Op} = require('sequelize')
const {Favor} = require('./favor')

class HotBook extends Model {
  static async getAll(){
    const books = await HotBook.findAll({
      order:['index']
    })
    const ids = []
    // 不能在forEach里面用await
    books.forEach((book) => {
      ids.push(book.id)
    })

    const favors = await Favor.findAll({
      where:{
        art_id: {
          [Op.in]: ids,
        },
        type: 400
      },
      group:['art_id'], // 以art_id分组
      // 求和相同的art_id
      attributes:['art_id', [Sequelize.fn('COUNT', '*'), 'count']] // 指定返回数据的属性
    })
    books.forEach(book => {
      HotBook._getEachBookStatus(book, favors)
    })
    return books
  }
  static _getEachBookStatus(book, favors){
    let count = 0
    favors.forEach(favor => {
      if(book.id === favor.art_id){
        count = favor.get('count')
      }
    })
    book.setDataValue('fav_nums', count)
    return book
  }
}

// 最好在API里面写，原型链上风险较大
HotBook.prototype.exclude = ['created_at', 'deleted_at', 'updated_at']

HotBook.init({
  index: Sequelize.INTEGER, 
  image: Sequelize.STRING, 
  author: Sequelize.STRING, 
  title: Sequelize.STRING, 
},{
  sequelize: db,
  tableName: 'hot_book'
})


module.exports = {
  HotBook
}