'use strict'

const uuid = require('uuid-base62')

// Para este modulo no haremos uso de notacion ECMA2016 ya que no usaremos micro
// el cual nos ayudaba a transpilar el código en ECMA2016
const fixtures = {
  getImage () {
    let id = uuid.uuid()
    return {
      description: 'an #awesome pictures with #tags with #platzi',
      tags: ['awesome', 'tags', 'platzi'],
      url: `https://platzigram.test/${uuid.v4()}.jpg`,
      likes: 0,
      liked: false,
      id: id,
      userId: uuid.uuid(),
      publicId: uuid.encode(id),
      createdAt: new Date().toString()
    }
  },
  getImages (n) {
    let images = []
    while (n-- > 0) {
      images.push(this.getImage())
    }
    return images
  },
  getUser () {
    return {
      id: uuid.uuid(),
      name: 'A random user',
      username: 'platzigram',
      createdAt: new Date().toString()
    }
  }
}

module.exports = fixtures
