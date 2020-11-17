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
  console.log('Video : add video stream')
  addVideoStream(myVideo, stream)
  console.log('Video : stream added')

  // Not getting triggered?
  myPeer.on('call', call => {
    console.log('Peer:call : call')
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log('Call:stream')
      addVideoStream(video, userVideoStream, call.id)
    })
  })

  socket.on('user-connected', userId => {
    console.log(`Socket:user-connected : ${userId} wants to connect`)
    connectToNewUser(userId, stream)
  })
}).catch(err => {
  console.log('Video : could not connect to media device')
  myVideo.innerHTML = 'Could not connect to media device'
  videoGrid.append(myVideo)
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close()
    console.log(`Socket:user-disconnected : ${userId} disconnected`)
  }
})

myPeer.on('open', id => {
  document.getElementById('uid-display').innerHTML = id
  myVideo.id = id
  socket.emit('join-room', ROOM_ID, id)
  console.log(`Peer:open ${id} joining ${ROOM_ID} (emit join-room)`)
})

function connectToNewUser(userId, stream) {
  console.log(`ConnectToNewUser : connect to user ${userId}`)
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  // event not received
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    console.log(`Call:stream : connected ${userId}'s stream`)
  })
  call.on('close', () => {
    video.remove()
    console.log(`Call:close : closed ${userId}'s connection`)
  })

  peers[userId] = call
  console.log(`ConnectToNewUser : connected to ${userId}`)
}

function addVideoStream(video, stream, id) {
  video.srcObject = stream
  if (id) video.id = id
  video.addEventListener('loadedmetadata', () => {
    video.play()
    console.log('AddVideoStream : play video')
  })
  videoGrid.append(video)
}
