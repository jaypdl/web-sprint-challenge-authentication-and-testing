const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

server.get('/', (req, res) => {
  res.send('The server is running')
})

server.use('*', (req, res) => {
  res.status(404).json({
    message: `Sorry, this is not a valid location for a ${req.method} request`
  })
})

// Error Catching
// eslint-disable-next-line
server.use((err, req, res, next) => {
  res.status(500).json({
    message: `A problem has occured with your ${req.method} request`,
    errMessage: err.message,
    stack: err.stack
  })
})

module.exports = server;
