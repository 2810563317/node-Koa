const {db} = require('../../core/db')
const {Sequelize, Model, Op} = require('sequelize')
const { Art } = require('./art')

class Favor extends Model {
  static async like(art_id, type, uid){
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if(favor){
      throw new global.errs.LikeError()
    }

    // 数据库事务：保证数据的一致性（保证多个操作同时完成， 否则都撤销）
    return db.transaction(async t => {
      //1
      await Favor.create({
        art_id, type, uid
      }, {transaction: t})
      //2
      const art = await Art.getData(art_id, type, false)
      // art.increment('fav_nums', {by: 1})
      await art.increment('fav_nums', {by: 1, transaction: t})
    })
  }

  static async disLike(art_id, type, uid){
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    if(!favor){
      throw new global.errs.DislikeError()
    }
    return db.transaction(async t => {
      // 查询出来的直接destroy
      await favor.destroy({
        force: true, // 物理删除或软删除
        transaction: t
      })

      const art = await Art.getData(art_id, type, false)
      await art.decrement('fav_nums', {by: 1, transaction: t})
    })
  }

  static async userLikeIt(art_id, type, uid){
    const favor = await Favor.findOne({
      where:{
        art_id,
        type,
        uid
      }
    })
    return favor ? true: false
  }
  static async getMyClassicFavors(uid){
    const arts = await Favor.findAll({
      where:{
        uid,
        type:{ // type不等于400
          [Op.not]:400,
        }
      }
    })
    if(!arts){
      throw new global.errs.NotFound()
    }
    return await Art.getList(arts)
  }
}
Favor.init({
  uid: Sequelize.STRING, // 期数
  art_id: Sequelize.INTEGER, //实体id、
  type: Sequelize.INTEGER // 定位具体的表
},{
  sequelize: db,
  tableName: 'favor'
})

module.exports = {
  Favor
}