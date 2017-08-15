'use strict'

const request = require('request-promise')
const Promise = require('bluebird')

class Client {
  // ya que estamos recibiendo opciones de configuracion, tenemos question que
  // crear un constructor, si no se pasan opciones, las opciones serán por default
  constructor (options) {
    this.options = options || {
      // Estas serán nuestras rutas por default en produccion
      endpoints: {
        pictures: 'http://api.platzigram.com/picture',
        users: 'http://api.platzigram.com/user',
        auth: 'http://api.platzigram.com/auth'
      }
    }
  }

  getPicture (id, callback) {
    let opts = {
      method: 'GET',
      url: `${this.options.endpoints.pictures}/${id}`,
      json: true
    }
    // Se resuelve la promesa interna de la peticion http que
    // recibio y si se le pasa un callback, retornará la respuesta
    // como una funcion asincrona de node.
    return Promise.resolve(request(opts)).asCallback(callback)
  }

  savePicture (picture, token, callback) {
    let opts = {
      method: 'POST',
      url: `${this.options.endpoints.pictures}/`,
      body: picture,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      json: true
    }
    // Se resuelve la promesa interna de la peticion http que
    // recibio y si se le pasa un callback, retornará la respuesta
    // como una funcion asincrona de node.
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  likePicture (id, callback) {
    let opts = {
      method: 'POST',
      url: `${this.options.endpoints.pictures}/${id}/like`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  listPictures (callback) {
    let opts = {
      method: 'GET',
      url: `${this.options.endpoints.pictures}/list`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  listPicturesByTag (tag, callback) {
    let opts = {
      method: 'GET',
      url: `${this.options.endpoints.pictures}/tag/${tag}`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  saveUser (user, callback) {
    let opts = {
      method: 'POST',
      url: `${this.options.endpoints.users}/`,
      body: user,
      json: true
    }

    return Promise.resolve(request(opts)).asCallback(callback)
  }
  getUser (username, callback) {
    let opts = {
      method: 'GET',
      url: `${this.options.endpoints.users}/${username}`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  auth (username, password, callback) {
    let opts = {
      method: 'POST',
      // Hacemos peticiones a las rutas de autentificacion que esta
      // definida en el home
      url: `${this.options.endpoints.auth}/`,
      body: {
        username,
        password
      },
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
}

module.exports = Client
