const express = require('express')
const { PeerServer } = require('peer')
const app = express()
const fs = require('fs')
const creds = {
  key: fs.readFileSync('cert/key.pem', 'utf8'),
  cert: fs.readFileSync('cert/cert.pem', 'utf8')
}
const cors = require('cors')
const server = require('https').Server(creds, app)
const io = require('socket.io')(server)

const serverPort = process.env.PORT || 3000
const peerPort = (serverPort + 1) % 65536
const peerPath = '/'
const peerServer = PeerServer({ port: peerPort, path: peerPath, ssl: creds })

const { v4: uuidV4 } = require('uuid')
const Logger = require('./logger.js')
const logger = new Logger('DEBUG')

const corsOpts = { origin: true, methods: ['GET', 'POST'], credentials: true }
app.use(cors(corsOpts))
app.options('/:room', cors(corsOpts))

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res, next) => {
  res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req, res, next) => {
  res.render('room', {
    roomId: req.params.room, pPort: peerPort, pPath: peerPath
  })
  const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  logger.log(`User at ${addr} requested ${req.params.room}`, 'DEBUG')
  next()
})

io.on('connection', socket => {
  logger.log('connected')
  socket.on('join-room', (roomId, userId) => {
    // problem exists between here…
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    logger.log(`${userId} connected to ${roomId}`, 'DEBUG')
    // … and here
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      logger.log(`${userId} disconnected from ${roomId}`)
    })
  })
})

server.listen(serverPort)
logger.log(
  `Listening on port ${serverPort}, peerjs server on ${peerPort}`, 'INFO'
)
