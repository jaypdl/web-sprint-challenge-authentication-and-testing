const Auth = require('./auth-model')

const checkUserExists = async (req, res, next) => {
  try {
    const { username } = req.body
    const user = await Auth.findBy({ username })
    req.userInfo = user
    next()
  } catch (err) {
    next(err)
  }
}

const validateRequestBody = (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password || !username.trim() || !password.trim()) {
    res.status(400).json({ message: 'username and password required' })
  } else {
    req.body.username = req.body.username.trim().toLowerCase()
    req.body.password = req.body.password.trim()
    next()
  }
}

module.exports = {
  checkUserExists,
  validateRequestBody
}
