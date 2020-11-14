const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: PEER_PORT,
  path: PEER_PATH
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  console.log('Add video stream')
  addVideoStream(myVideo, stream)
  console.log('Stream added')

  myPeer.on('call', call => {
    console.log('call')
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log('stream')
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    console.log(`${userId} wants to connect`)
    connectToNewUser(userId, stream)
  })
}).catch(err => {
  console.log(err)
  myVideo.innerHTML = 'Could not connect to media device'
  videoGrid.append(myVideo)
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close()
    console.log(`${userId} disconnected`)
  }
})

myPeer.on('open', id => {
  document.getElementById('uid-display').innerHTML = id
  socket.emit('join-room', ROOM_ID, id)
  console.log(`${id} joining ${ROOM_ID}`)
})

function connectToNewUser(userId, stream) {
  console.log(`Connect to user ${userId}`)
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    console.log(`Connected ${userId}'s stream`)
  })
  call.on('close', () => {
    video.remove()
    console.log(`Closed ${userId}'s connection`)
  })

  peers[userId] = call
  console.log(`Connected to ${userId}`)
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
