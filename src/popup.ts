import {ExtensionEvent, Message} from "./types";

console.log("CrunchParty popup script running.");

document.getElementById('createRoom')?.addEventListener('click', () => {
    console.log('Create Room clicked');
    chrome.runtime.sendMessage({ event: ExtensionEvent.createRoom }).then((response: Message) => {
        if (response.event === ExtensionEvent.roomCreated) {
            console.log('Room created successfully');
            document.getElementById('roomUrl')!.innerText = response.data;
        }
    });
});


document.getElementById('joinRoom')?.addEventListener('click', () => {
    console.log('Join Room clicked');
    // Logic to join a room
});

document.addEventListener('DOMContentLoaded', function () {
   chrome.runtime.sendMessage({ event: ExtensionEvent.requestRoomId })
});


chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message received in popup script: ", message);
    if (message.event === ExtensionEvent.roomCreated) {
        console.log('Room created successfully popup');
        document.getElementById('roomUrl')!.innerText = message.data;
    }
    if (message.event === ExtensionEvent.roomIdFound) {
        console.log('Room ID found');
        document.getElementById('roomUrl')!.innerText = message.data;
    }
});
