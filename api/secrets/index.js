module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'shh',
  ROUNDS: process.env.BCRYPT_ROUNDS || 8
}
