const util = require('util')
const axios = require('axios')

const {db} = require('../../core/db')
const {Sequelize, Model} = require('sequelize')

// Sequelize目前不支持继承的方式创建modle
const classicFields = {
  image: {
      type:Sequelize.STRING,
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.DATEONLY,
  fav_nums: {
      type:Sequelize.INTEGER,
      defaultValue:0
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
}

class Movie extends Model {
}
Movie.init(classicFields,{
  sequelize: db,
  tableName: 'movie'
})

class Sentence extends Model {
}
Sentence.init(classicFields,{
  sequelize: db,
  tableName: 'sentence'
})

class Music extends Model {
}
const musicFields = Object.assign({url: Sequelize.STRING}, classicFields)
Music.init(musicFields,{
  sequelize: db,
  tableName: 'music'
})

class Book extends Model {
  // constructor(id){  //添加构造函数会导致bug
  //   super()
  //   this.id = id
  // }
  async detail(id){
    const url = util.format(global.config.yushu.detailUrl, id)
    const detail = await axios.get(url)
    return detail.data
  }
  static async searchFromYuShu(q, start, count, summary = 1){
    const url = util.format(global.config.yushu.keywordUrl, encodeURI(q), count, start, summary)
    const result = await axios.get(url)
    return result.data
  }
  static async getMyFavorBookCount(uid){
    const {Favor} = require('./favor')
    // Favor.count只返回数量
    const count = await Favor.count({
      where:{
        type: 400,
        uid
      }
    })
    return count
  }
}
Book.init({
  id:{
    type:Sequelize.INTEGER,
    primaryKey: true
  },
  fav_nums: {
    type:Sequelize.INTEGER,
    defaultValue:0
  },
},{
  sequelize: db,
  tableName: 'book'
})

// 三个实体模型
module.exports = {
  Movie,
  Sentence,
  Music,
  Book
}