var peer = null;
var myStream = null;
var peerList = [];

// Initialize PeerJS with a unique ID (userId)
function init(userId) {
    peer = new Peer(userId);

    peer.on('open', (id) => {
        console.log(id + " connected");
    });

    listenToCall();
}

// Listen for incoming calls
function listenToCall() {
    peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            myStream = stream;
            addLocalVideo(stream);
            call.answer(stream);
            handleCall(call);
        }).catch((err) => {
            console.error("Unable to get user media:", err);
        });
    });
}

// Function to handle a call object
function handleCall(call) {
    call.on('stream', (remoteStream) => {
        if (!peerList.includes(call.peer)) {
            addRemoteVideo(remoteStream);
            peerList.push(call.peer);
        }
    });

    // Store the call object in peerList
    peerList.push(call.peer);
}

// Function to join a room (make a call to all current peers in the room)
function joinRoom(roomId) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        myStream = stream;
        addLocalVideo(stream);

        // Call all existing peers in the room
        for (let peerId of peerList) {
            let call = peer.call(peerId, stream);
            handleCall(call);
        }

        // Listen for new incoming calls
        peer.on('call', (call) => {
            call.answer(stream);
            handleCall(call);
        });

        // Add current peer to its own peerList
        peerList.push(peer.id);
    }).catch((err) => {
        console.error("Unable to get user media:", err);
    });
}

// Function to make a call to a specific receiverId (join a room or start a new call)
function makeCall(receiverId) {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        myStream = stream;
        addLocalVideo(stream);

        let call = peer.call(receiverId, stream);
        handleCall(call);
    }).catch((err) => {
        console.error("Unable to get user media:", err);
    });
}

// Function to add local stream to video panel
function addLocalVideo(stream) {
    let video = document.createElement("video");
    video.srcObject = stream;
    video.classList.add("video");
    video.muted = true; // Local video needs to be muted
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

// Toggle video track on/off
function toggleVideo(enabled) {
    if (myStream) {
        myStream.getVideoTracks()[0].enabled = enabled;
    }
}

// Toggle audio track on/off
function toggleAudio(enabled) {
    if (myStream) {
        myStream.getAudioTracks()[0].enabled = enabled;
    }
}
