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
    call.answer(stream)
    console.log("Answered myPeer call")
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      console.log("Stream Event")
      addVideoStream(video, userVideoStream)
      console.log("Adding Video stream from peer")
    })
  }, (err)=>{console.error("FAILURE RECEIVING", err);
})

  socket.on('user-connected', userId => {
    console.log("Connecting to new User")
    connectToNewUser(userId, stream)
    console.log("Completed Connection to New User")
  })
}, (err)=> {console.error("FAILURE" , err);
})

socket.on('user-disconnected', userId => {
  console.log("User disconnected")
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  console.log("Peer has opened; join-room even emitted")
  socket.emit('join-room', ROOM_ID, id)
  console.log("user ID: " + id)
})

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

function connectToNewUser(userId, stream) {
  console.log(userId)
  const video = document.createElement('video')
  const call = myPeer.call(userId, stream)
  sleep(3000)
  call.on('stream', userVideoStream => {
    console.log("SUCCESS")
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  peers[userId] = call
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
