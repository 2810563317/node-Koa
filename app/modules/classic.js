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

// 三个实体模型
module.exports = {
  Movie,
  Sentence,
  Music
}