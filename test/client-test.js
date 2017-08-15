'use strict'

const test = require('ava')
const platzigram = require('../')
const fixtures = require('./fixtures')
// Lo que hace nock, es crear un mock de todos los
// servidores de nuestros API (imagenes, usuarios, base de datos)
const nock = require('nock')

let options = {
  endpoints: {
    pictures: 'http://platzigram.test/picture',
    users: 'http://platzigram.test/user',
    auth: 'http://platzigram.test/auth'
  }
}

test.beforeEach((t) => {
  t.context.client = platzigram.createClient(options)
})

// Este test simplemente verifica que existan los metodos dentro de la clase
test('client', (t) => {
  // Aqui creamos una referencia del proyecto, nos entregará una referencia
  // de la libreria
  const client = t.context.client
  // Las siguientes comprobaciones de metodos, nos ayudaran a realizar las
  // peticiones HTTP a las rutas que les corresponde, ya no tenemos que hacer
  // un request directo is no que ahora es mas facil realizar las peticiones
  t.is(typeof client.getPicture, 'function', 'getPicture is a function')
  // savePicture es una funcion que va a hacer la implementacion del
  // HTTP request POST a la ruta /picture
  t.is(typeof client.savePicture, 'function')
  // likePicture va a llamar a la ruta de like que es la /POST/:id/like
  t.is(typeof client.likePicture, 'function')
  // likePicture va a llamar a la ruta de like que es la /POST/:id/like
  t.is(typeof client.listPictures, 'function')
  t.is(typeof client.listPictures, 'function')
  t.is(typeof client.listPicturesByTag, 'function')
  t.is(typeof client.saveUser, 'function')
  t.is(typeof client.getUser, 'function')
  t.is(typeof client.auth, 'function')
})

test('getPicture', async (t) => {
  const client = t.context.client
  let image = fixtures.getImage()
  // Utilizamos la libreria de nock para poder hacer un mock
  // del servidor para obtener las images
  // Nock intercepta las peticiones HTTP que se hagan
  nock(options.endpoints.pictures)
    // Esta será la peticion a la URL
    .get(`/${image.publicId}`)
    // Esto es lo que retorna el servidor
    .reply(200, image)
    // De esta manera hemos implementado el mock de la peticion HTTP
  // Ahora bien, realizamos la ejecucacion del cliente,
  // Ejecutamos al cliente como una promesa
  let result = await client.getPicture(image.publicId)
  // Comparamos los objetos que sean iguales, de esta manera probamos
  // la funcionalidad de getPicture
  t.deepEqual(image, result)
})

test('savePicture', async (t) => {
  const client = t.context.client
  // Creamos un post pues hemos definido que este POST debe de ser seguro
  let token = 'xxx-xxx-xxx'
  // Obtenemos la imagen de los fixtures
  let image = fixtures.getImage()
  // Esta sera la nueva imagen que queremos guardar
  let newImage = {
    // La ruta y descripcion sera la misma que la imagen de los fixtures
    src: image.src,
    description: image.description
  }
  // Ahora utilizaremos a nock para realizar un POST
  // Le pasamos como segundo argumento los headers que queremos pasar
  // a traves de la peticion HTTP
  nock(options.endpoints.pictures, {
    // Definimos los headers que enviaremos en la peticion HTTP
    reqheaders: {
      // Le enviamos el header de autorizacion
      'Authorization': `Bearer ${token}`
    }
  })
    // Vamos a hacer post a la ruta principal, le daremos una ruta tipo post y
    // como segundo parametro le pasamos el objeto que le queremos pasar.
    .post(`/`, newImage)
    // Retornamos un codigo 201 y la imagen para despues compararla
    .reply(201, image)
  let result = await client.savePicture(newImage, token)
  t.deepEqual(result, image)
})

test('likePicture', async (t) => {
  const client = t.context.client
  let image = fixtures.getImage()
  image.liked = true
  image.likes = 1
  // Definimos a donde vamos a realizar la peticion
  nock(options.endpoints.pictures)
    // Definimos que tipo de metodo vamos a utilizar y a que ruta, esta ruta
    // es con la que nock intercepta las peticiones HTTP y las matchea con las rutas
    // declaradas en la implementacion de client
    .post(`/${image.publicId}/like`)
    .reply(201, image)
  let result = await client.likePicture(image.publicId)
  t.deepEqual(image, result)
})

test('listPicture', async (t) => {
  const client = t.context.client
  let images = fixtures.getImages(3)
  nock(options.endpoints.pictures)
    .get('/list')
    .reply(201, images)
  let result = await client.listPictures()
  t.deepEqual(images, result)
})

test('listPicturesByTag', async (t) => {
  const client = t.context.client
  let images = fixtures.getImages(3)
  let tag = 'platzi'
  nock(options.endpoints.pictures)
    .get(`/tag/${tag}`)
    .reply(201, images)
  let result = await client.listPicturesByTag(tag)
  t.deepEqual(images, result)
})

test('saveUser', async (t) => {
  const client = t.context.client
  let user = fixtures.getUser()
  let newUser = {
    username: user.username,
    name: user.name,
    email: 'user@platzigram.test',
    password: 'pl4tzi'
  }
  nock(options.endpoints.users)
    .post('/', newUser)
    .reply(201, user)

  let result = await client.saveUser(newUser)
  t.deepEqual(result, user)
})

test('getUser', async (t) => {
  const client = t.context.client
  let user = fixtures.getUser()
  nock(options.endpoints.users)
    .get(`/${user.username}`)
    .reply(200, user)
  let result = await client.getUser(user.username)
  t.deepEqual(result, user)
})

test('auth', async (t) => {
  const client = t.context.client
  let credentials = {
    username: 'freddier',
    password: 'pl4tzi'
  }
  let token = 'xxx-xxx-xxx'
  nock(options.endpoints.auth)
    .post('/', credentials)
    .reply(200, token)
  let result = await client.auth(credentials.username, credentials.password)
  t.deepEqual(result, token)
})
