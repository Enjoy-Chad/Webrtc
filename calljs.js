var peer = new Peer();
var myStream;
var peerList = [];

// Initialize the peer with the user ID
function initializeUser() {
  var userId = document.getElementById('username').value;
  if (userId) {
    init(userId);
  } else {
    alert('Please enter a username');
  }
}

// Make a call to the receiver from the input field
function makeCallFromInput() {
  var receiverId = document.getElementById('receiver').value;
  if (receiverId) {
    makeCall(receiverId);
  } else {
    alert('Please enter the receiver\'s username');
  }
}

// Function to initiate the peer
function init(userId) {
  peer = new Peer(userId);
  peer.on('open', (id) => {
    console.log(id + " connected"); // If we connect successfully this will print
  });

  listenToCall();
}

// Function to keep listening to call or incoming events
function listenToCall() {
  peer.on('call', (call) => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then((stream) => {
      myStream = stream;
      addLocalVideo(stream);
      call.answer(stream);
      call.on('stream', (remoteStream) => {
        if (!peerList.includes(call.peer)) {
          addRemoteVideo(remoteStream);
          peerList.push(call.peer);
        }
      });
    }).catch((err) => {
      console.log("Unable to connect because " + err);
    });
  });
}

// Function to make a call
function makeCall(receiverId) {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then((stream) => {
    myStream = stream;
    addLocalVideo(stream);
    let call = peer.call(receiverId, stream);
    call.on('stream', (remoteStream) => {
      if (!peerList.includes(call.peer)) {
        addRemoteVideo(remoteStream);
        peerList.push(call.peer);
      }
    });
  }).catch((err) => {
    console.log("Unable to connect because " + err);
  });
}

// Function to add local stream to video panel
function addLocalVideo(stream) {
  let video = document.createElement("video");
  video.srcObject = stream;
  video.classList.add("video");
  video.muted = true; // Local video needs to be muted because of noise issue
  video.play();
  document.getElementById("localVideo").append(video);
}

// Function to add remote stream to video panel
function addRemoteVideo(stream) {
  let video = document.createElement("video");
  video.srcObject = stream;
  video.classList.add("video");
  video.play();
  document.getElementById("remoteVideo").append(video);
}

// Function to toggle video
function toggleVideo(b) {
  if (b == "true") {
    myStream.getVideoTracks()[0].enabled = true;
  } else {
    myStream.getVideoTracks()[0].enabled = false;
  }
}

// Function to toggle audio
function toggleAudio(b) {
  if (b == "true") {
    myStream.getAudioTracks()[0].enabled = true;
  } else {
    myStream.getAudioTracks()[0].enabled = false;
  }
}
