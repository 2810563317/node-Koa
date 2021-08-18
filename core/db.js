// Sequelize 连接数据库 配置一些数据库参数
const { Sequelize } = require('sequelize')

// dbname, user, passward, {}
const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database
const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql', // 数据库类型 mysql
  host,
  port,
  logging: true, // 显示sql操作
  timezone: '+08:00', //时区
  define: {
    timestamps: true, // false: 不展示创建、修改时间、删除时间
    paranoid: true, // 软删除
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true, //不使用驼峰式命令规则
    freezeTableName: true,
    scopes: {
      bh: {//  过滤不必要的字段
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'created_at']
        }
      }
    }
  }
})

//同步模型到数据库
sequelize.sync({
  force: false //true： 先删除表再重新创建
})

module.exports = {
  db: sequelize
}