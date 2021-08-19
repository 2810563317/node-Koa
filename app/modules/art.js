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
    const art = await Art.getData(this.art_id, this.type, uid)
    if(!art){
      throw new global.errs.NotFound()
    }
    return art
  }
  // 静态方法
  static async getData(art_id, type, useScope = true) {
    let art = null
    const finder = {
      where: {
        id: art_id
      }
    }
    const scope = useScope ? 'bh' : null
    switch (type) {
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
        const {
          Book
        } = require('./book')
        art = await Book.scope(scope).findOne(finder)
        if (!art) {
          art = await Book.create({
            id: art_id
          })
        }
        break
      default:
        break
    }
    return art
  }


  static async getList(artInfoList) {
    console.log(artInfoList)
    const artInfoObj = {
      100: [],
      200: [],
      300: []
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