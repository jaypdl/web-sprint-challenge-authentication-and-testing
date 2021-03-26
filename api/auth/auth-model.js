const db = require('../../data/dbConfig')

function findAll() {
  return db('users')
}

function findById(id) {
  return db('users').where('id', id)
}

function findBy(filter) {
  return db('users').where(filter).orderBy('id')
}

async function insertUser(user) {
  const [id] = await db('users').insert(user)
  return findById(id)
}

module.exports = {
  findAll,
  findById,
  findBy,
  insertUser
}
