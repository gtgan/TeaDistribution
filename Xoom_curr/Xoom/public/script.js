const socket = io('/')
const videoGrid = document.getElementById('video-grid')
/*const myPeer = new Peer(undefined, {
  host: 'tasdfas.ga',//'3.101.120.16',
  port: '3001'
})*/
const myPeer = new Peer(undefined, {
  host:'peerjs-server.herokuapp.com',
  secure:true,
  port:443
});
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  console.log("Adding Video Stream from me")

  myPeer.on('call', call => {
    console.log("Inside myPeer call; Call Event")
    sleep(10)
    const video = videoElement(call.peer)
    call.answer(stream)
    console.log(`Answered myPeer call from ${call.peer}`)
    call.on('stream', userVideoStream => {
      console.log("Stream Event")
      addVideoStream(video, userVideoStream)
      console.log(`Adding Video stream from peer ${call.peer}`)
    })
  }, (err) => {
    console.error(`FAILURE RECEIVING ${call.peer`, err);
  })

  socket.on('user-connected', userId => {
    console.log(`Connecting to new User ${userId}`)
    connectToNewUser(userId, stream)
    console.log("Completed Connection to New User")
  })
}, (err)=> {
  console.error("FAILURE" , err);
})

socket.on('user-disconnected', userId => {
  console.log(`User ${userId} disconnected`)
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  console.log("Peer has opened; join-room even emitted")
  socket.emit('join-room', ROOM_ID, id)
  console.log("user ID: " + id)
  myVideo.id = id
})

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function connectToNewUser(userId, stream, sleepTime) {
  if (sleepTime === 'undefined')
    sleepTime = 200
  console.log(`trying to connect to ${userId} with wait of ${sleepTime} ms`)
  const video = videoElement(userId)
  const call = myPeer.call(userId, stream)
  sleep(sleepTime)
  // TODO see if the call is okay
  call.on('stream', userVideoStream => {
    console.log(`SUCCESS: connected to ${userId}`)
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    console.log(`Closing connection to ${userId}`)
    video.remove()
  })
  peers[userId] = call
  if (sleepTime < 1600 && !call.open)
    connectToNewUser(userId, stream, sleepTime * 2)
}

// Get the video element with a given id if it exists, else create it
function videoElement(id) {
  var video = document.getElementById(id)
  if (video === 'undefined') {
    video = document.createElement('video')
    video.id = id
  }
  return video
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
