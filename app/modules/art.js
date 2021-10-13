const { Movie, Music, Sentence } = require("./classic");
const {flatten} = require('lodash')
const {Op} = require('sequelize')
class Art {
  
  constructor(art_id, type) {
    this.art_id = art_id
    this.type = type
  }
  // 实例方法
  async getDetail(uid) {
    const art = await new Art(this.art_id, this.type).getData()
    if(!art){
      throw new global.errs.NotFound()
    }
    // 可以避免循环导入报错
    const {Favor} = require('./favor')
    const like = await Favor.userLikeIt(this.art_id, this.type, uid)

    return {
      art,
      'like_status': like
    }
  }
  // 静态方法
  async getData(useScope = true) {
    let art = null
    const finder = {
      where: {
        id: this.art_id
      }
    }
    const scope = useScope ? 'bh' : null
    switch (this.type) {
      case 100:
        art = await Movie.scope(scope).findOne(finder)
        break
      case 200:
        art = await Music.scope(scope).findOne(finder)
        break
      case 300:
        art = await Sentence.scope(scope).findOne(finder)
        break
      case 400:
        const {Book} = require('./classic')
        art = await Book.scope(scope).findOne(finder)
        if (!art) {
          art = await Book.create({
            id: this.art_id
          })
        }
        break
      default:
        break
    }
    if(art && art.image){
      let imgUrl = art.dataValues.image
      art.dataValues.image = global.config.host + imgUrl
    }
    return art
  }


  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
      400: []
    }
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id)
    }

    const arts = []
    for (let key in artInfoObj) {
      const ids = artInfoObj[key]
      if (ids.length === 0) {
        continue
      }

      key = parseInt(key)
      arts.push(await Art._getListByType(ids, key))
    }
    // 二维转一维
    return flatten(arts)
  }
  static async _getListByType(ids, type) {
    let arts = []
    const finder = {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    }

    const scope = 'bh'
    switch (type) {
      case 100:
        arts = await Movie.scope(scope).findAll(finder)
        break
      case 200:
        arts = await Music.scope(scope).findAll(finder)
        break
      case 300:
        arts = await Sentence.scope(scope).findAll(finder)
      case 400:
        const {HotBook} = require('./hotBook')
        arts = await HotBook.scope(scope).findAll(finder)
        const books = await Book.scope(scope).findAll(finder)
        for(let i in arts){
          for(let j in books){
            if(arts[i].id === books[j].id){
              arts[i].dataValues.fav_nums = books[j].fav_nums
              break
            }
          }
        }
        break
      default:
        break
    }
    return arts
  }

}

module.exports = {
  Art
}