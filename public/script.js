const socket = io("/");
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: 9000
});
// var conn = peer.connect('another-peers-id');
const videoContainer = document.getElementById("videos");
const video = document.getElementById("video");
const audio = document.getElementById("audio");
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const messagesBox = document.getElementById("messages");



navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    console.log(stream);
    let v = document.createElement('video');
    addAndAppendVideo(v, stream);
    socket.on('user-joined', userId => {
        console.log({userId, stream});
        connectToNewUserAndAppendVideo(userId, stream);
    })

    socket.on('get-message', (msg, id) => {
        console.log({msg, id});
        let newMessage = `<div class='message'>
        <span>${id.substring(0, 12) + '...'}</span>
        <p>${msg}</p>
        </div>`;
        messagesBox.insertAdjacentHTML('beforeend', newMessage);
        const height =  messagesBox.scrollHeight;
        console.log({height});
        window.scrollTo(0, height);
    })


    peer.on('call', call => {
        console.log({call})
        call.answer(stream);
        let v = document.createElement('video');
        call.on('stream', remoteStream => {
            addAndAppendVideo(v, remoteStream);
        })
    })
    video.addEventListener("click", e => {
        toggleVideo(stream);
    })
    audio.addEventListener("click", e => {
        toggleAudio(stream);
    })
    chat.addEventListener("click", e => {
        console.log(e.currentTarget);
        document.querySelector(".main__right").style.display = document.querySelector(".main__right").style.display === 'none' ? 'flex' : 'none';
    });
    input.addEventListener("keydown", e => {
        if(e.key === 'Enter'){
            if(e.target.value.trim() === '') return;
            else {
                console.log(e.target.value);
                socket.emit('message', e.target.value);
            }
        }
    })
})

peer.on('open', id => {
    console.log({id, ROOMID});
    socket.emit("join-room", ROOMID, id);
})


// socket.on('user-joined', userId => {
//     var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//     getUserMedia({
//         video: true,
//         audio: true
//     }, stream => {
//         console.log({userId, stream});
//         connectToNewUserAndAppendVideo(userId, stream);
//     }, err => {
//         console.log({err});
//     })
// })


function addAndAppendVideo(v, stream){
    v.srcObject = stream;
    v.addEventListener('loadedmetadata', e => {
        console.log(e);
        v.play()
    })
    videoContainer.append(v);
}



function connectToNewUserAndAppendVideo(userId, stream){
    let call = peer.call(userId, stream);
    console.log({call, stream})
    let v = document.createElement('video');
    call.on('stream', userStream => {
        console.log({userStream});
        addAndAppendVideo(v, userStream);
    })
}



function toggleAudio(stream){
    let enabled = stream.getAudioTracks()[0].enabled;
    console.log({enabled});
    if(enabled){
        stream.getAudioTracks()[0].enabled = false;
        document.querySelector("#audio i").className = "fa-solid fa-microphone-slash";
        document.querySelector("#audio i").style.color = "red";
        document.querySelector("#audio span").textContent = "Unmute";
    }else {
        stream.getAudioTracks()[0].enabled = true;
        document.querySelector("#audio i").className = "fa-solid fa-microphone";
        document.querySelector("#audio i").style.color = "whitesmoke";
        document.querySelector("#audio span").textContent = "Mute";
    }
}


function toggleVideo(stream){
    let enabled = stream.getVideoTracks()[0].enabled;
    console.log({enabled});
    if(enabled){
        stream.getVideoTracks()[0].enabled = false;
        document.querySelector("#video i").className = "fa-solid fa-video-slash";
        document.querySelector("#video i").style.color = "red";
        document.querySelector("#video span").textContent = "Show Video";
    }else {
        stream.getVideoTracks()[0].enabled = true;
        document.querySelector("#video i").className = "fa-solid fa-video";
        document.querySelector("#video i").style.color = "whitesmoke";
        document.querySelector("#video span").textContent = "Stop Video";
    }
}

console.log({socket, peer});


