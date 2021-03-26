const Auth = require('./auth-model')

const checkUserExists = async (req, res, next) => {
  try {
    const { username } = req.body
    const user = await Auth.findBy({ username })
    req.userInfo = await user
    next()
  } catch (err) {
    next(err)
  }
}

const checkRequestBody = (req, res, next) => {
  const { username, password } = req.body
  if (!username?.trim() || !password?.trim()) {
    res.status(400).json({ message: 'username and password required' })
  } else {
    next()
  }
}

module.exports = {
  checkUserExists,
  checkRequestBody
}
