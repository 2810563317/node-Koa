const { max } = require('lodash')
const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const {User} = require('@modules/user')
const {LoginType, ArtType} = require('../lib/enum')
//校验正整数
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule('isInt', '需要是正整数', { min: 1 })
    ]
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [
      new Rule('isEmail', '不符合Email规范')
    ]
    this.password1 = [
      new Rule('isLength', '密码至少6个字符，最多32个字符', { min: 6, max: 32 }),
      new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]') // 正则：非123456，$
    ]
    this.password2 = this.password1
    this.nickname = [
      new Rule('isLength', '昵称不符合长度规范', { min: 4, max: 32 }),
    ]
  }
  validatePassword(vals){
    const {password1, password2} = vals.body
    if(password1 !== password2) {
      throw new Error('两个密码不相同')
    }
  }
  async validateEmail(vals){
    const email = vals.body.email
    //数据库查找
    const user = await User.findOne({
      where: {
        email:email
      }
    })
    if(user){
      throw new Error('email已存在')
    }
  }
}

class Checker{
  constructor(type){
    this.enumType = type
  }
  check(vals){
    let type = vals.body.type || vals.path.type
    if(!type){
      throw new Error('type是必填字段')
    }
    //转类型
    type = parseInt(type)
    // this.parsed.path.type = type
  
    if(!this.enumType.isThisType(type)){
      throw new Error('type参数不合法')
    }
  }
}
//校验Token
class TokenValidator extends LinValidator {
  constructor() {
    super()
    // 账号
    this.account = [
      new Rule('isLength', '不符合账号规则', { min: 4, max: 32})
    ]
    // 密码：传统登陆：account+secrec, 小程序：account
    this.secret = [
      new Rule('isOptional'), // 可以不传， 否则要符合规则
      new Rule('isLength', '至少6个字符', { min: 6, max: 128})
    ]
    const checker = new Checker(LoginType)
    this.validateType = checker.check.bind(checker)
  }
}

class NotEmptyValidator extends LinValidator {
  constructor(){
    super()
    this.token = [
      new Rule('isLength', '不允许为空', {min: 1})
    ]
  }
}

class LikeValidator extends PositiveIntegerValidator {
  constructor(){
    super()
    const checker = new Checker(ArtType)
    this.validateType = checker.check.bind(checker)
  }
}
class ClassicValidator extends LikeValidator {}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator
}