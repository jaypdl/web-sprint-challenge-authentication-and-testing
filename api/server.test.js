const server = require('./server')
const request = require('supertest')
const db = require('../data/dbConfig')
const jokes = require('../api/jokes/jokes-data')

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
  it('creates new user in DB', async () => {
    const newUser = { username: 'dude', password: '123' }
    expect(await db('users').where('username', 'dude').first()).toBeFalsy()
    await request(server).post('/api/auth/register').send(newUser)
    expect(await db('users').where('username', 'dude').first()).toBeTruthy()
  })
  it('responds with a 201', async () => {
    const newUser = { username: 'dude', password: '123' }
    const res = await request(server).post('/api/auth/register').send(newUser)
    expect(res.status).toBe(201)
  })
})

describe('[POST] /api/auth/login', () => {
  it('responds with "username and password required" when missing either', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: '', password: '' })
    expect(res.body.message).toMatch(/username and password required/i)
    res = await request(server)
      .post('/api/auth/login')
      .send({ username: '', password: 'password' })
    expect(res.body.message).toMatch(/username and password required/i)
    res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'username', password: '' })
    expect(res.body.message).toMatch(/username and password required/i)
    res = await request(server)
      .post('/api/auth/login')
      .send({ username: null, password: null })
    expect(res.body.message).toMatch(/username and password required/i)
    res = await request(server).post('/api/auth/login').send()
    expect(res.body.message).toMatch(/username and password required/i)
  })
  it('responds with "invalid credentials" when incorrect password is used', async () => {
    const newUser = { username: 'bill', password: 'password' }
    await request(server).post('/api/auth/register').send(newUser)
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'bill', password: 'notPassword' })
    expect(res.body.message).toMatch(/invalid credentials/i)
  })
})

describe('[GET] /api/jokes', () => {
  it('responds with "token required" when no authorization token', async () => {
    let res = await request(server).get('/api/jokes')
    expect(res.body.message).toMatch(/token required/i)
  })
  it('responds with jokes when request with valid token', async () => {
    const newUser = { username: 'jokeLover', password: 'abc123' }
    await request(server).post('/api/auth/register').send(newUser)
    const logIn = await request(server).post('/api/auth/login').send(newUser)
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', logIn.body.token)
    expect(res.body).toMatchObject(jokes)
  })
})
