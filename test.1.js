const obj1 = {
  name: 'zita',
  age: 18,
  toJSON: function(){
    return {
      name: '爱zita'
    }
  }
}

// 只会序列化toJSON方法返回的值
console.log(JSON.stringify(obj1))