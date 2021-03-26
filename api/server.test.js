const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db('users').truncate()
})
afterAll(async () => {
  await db.destroy()
})
describe('[POST] /api/auth/register', () => {
  it('it responds with a 201', async () => {
    const newUser = { username: 'dude', password: '123' }
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(201)
  })
})
