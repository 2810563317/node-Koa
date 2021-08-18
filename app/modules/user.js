const bcrypt = require('bcryptjs') // 密码加密

const {db} = require('../../core/db')

const {Sequelize, Model} = require('sequelize')

class User extends Model {
  static async verifyEmailPassword(email, plainPassword) {
      const user = await User.findOne({
          where: {
              email
          }
      })
      if (!user) {
          throw new global.errs.AuthFailed('账号不存在')
      }
      const correct = bcrypt.compareSync(
          plainPassword, user.password)
      if(!correct){
          throw new global.errs.AuthFailed('密码不正确')
      }
      return user
  }

  static async getUserByOpenid(openid){
    const user = await User.findOne({
      where: {
        openid
      }
    })
    return user
  }

  static async registerByOpenid(openid){
    const user = await User.create({
      openid
    })
    return user
  }

}

User.init({
  // id可自动生成
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, // 主键
    autoIncrement: true  // 自增长
  },
  nickname: Sequelize.STRING,
  email: {
    type: Sequelize.STRING(128), // 类型， 长度
    unique: true // 唯一
  },
  password: {
    type: Sequelize.STRING,
    set(val){
      //密码加密  数字越大成本越大
      const solt = bcrypt.genSaltSync(10)
      const psw = bcrypt.hashSync(val, solt)
      //模型设值
      this.setDataValue('password', psw)
    }
  
  },
  openid: {
    type: Sequelize.STRING(64), // 类型， 长度
    unique: true // 唯一
  }
},{
  sequelize: db,
  tableName: 'user'
})

module.exports = {User}