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

class Flow extends Model {
}
Flow.init({
  index: Sequelize.INTEGER, // 期数
  art_id: Sequelize.INTEGER, //实体id、
  type: Sequelize.INTEGER // 定位具体的表
  // type: 100 Movie 200 Music 300 Sentence
},{
  sequelize: db,
  tableName: 'flow'
})


module.exports = {
  Flow
}