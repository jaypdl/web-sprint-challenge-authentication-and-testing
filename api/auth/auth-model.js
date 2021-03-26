const db = require('../../data/dbConfig')

function findAll() {
  return db('users')
}

function findById(id) {
  return db('users').where('id', id)
}

async function findBy(filter) {
  const [found] = await db('users').where(filter).orderBy('id')
  return found
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
