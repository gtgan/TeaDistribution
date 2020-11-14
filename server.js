const express = require('express')
const { PeerServer } = require('peer')
const app = express()
const fs = require('fs')
const credentials = {
  key: fs.readFileSync('cert/key.pem', 'utf8'),
  cert: fs.readFileSync('cert/cert.pem', 'utf8')
}
const cors = require('cors')
const server = require('https').Server(credentials, app)
const io = require('socket.io')(server)

const serverPort = process.env.PORT || 3000
const peerPort = (serverPort + 1) % 65536
const peerPath = '/peerjs'
const peerServer = PeerServer({
  port: peerPort, path: peerPath, ssl: credentials
})

const { v4: uuidV4 } = require('uuid')

// sloppy but useful logger thingymabob
function Logger(loggingLevel, writeStream) {
  this.levels = ['ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', 'OFF']
  this.level = (logLevel) => {
    if (this.levels.includes(logLevel))
      return logLevel
    else
      return this.levels[logLevel] || this.levels[0]
  }
  this.levelIndex = (level) => {
    const i = Number.isInteger(level) ? level : this.levels.indexOf(level)
    return Math.max(i, 0)
  }
  this.logLevel = this.levelIndex(loggingLevel)
  this.writeStream = writeStream || process.stdout
  this.log = (message, level) => {
    const l = this.levelIndex(level)
    if (l < this.logLevel)
      return
    else
      return this.writeStream.write(
        `${new Date().toISOString()} | ${this.level(l)} | ${message}\n`
      )
  }
}
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
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    logger.log(`${userId} connected to ${roomId}`, 'DEBUG')
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
      logger.log(`${userId} disconnected from ${roomId}`)
    })
  })
})

server.listen(serverPort)
logger.log(
  `Listening on ${server.address().address}:${serverPort}`,
  'INFO'
)
