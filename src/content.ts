import Peer, {DataConnection} from 'peerjs';
import {CommunicationEvent, ExtensionEvent, Message} from "./types";

let peer: Peer;
let open: boolean = false;
let externalCommand: boolean = false;
let connection: DataConnection;
const video = document.querySelector('video') as HTMLVideoElement;


console.log("CrunchParty content script running.");
function peerFactory(createRoom: boolean = false): Peer
{
    let peer = new Peer({
        host: '0.peerjs.com',
        port: 443,
        debug: 0,
        config: {'iceServers':
            [
                {
                    urls: "stun:stun.relay.metered.ca:80",
                },
                {
                    urls: "turn:global.relay.metered.ca:80",
                    username: "beba88570d66f4cc9406abc9",
                    credential: "Enux9GbTRpyzDhhP",
                },
                {
                    urls: "turn:global.relay.metered.ca:80?transport=tcp",
                    username: "beba88570d66f4cc9406abc9",
                    credential: "Enux9GbTRpyzDhhP",
                },
                {
                    urls: "turn:global.relay.metered.ca:443",
                    username: "beba88570d66f4cc9406abc9",
                    credential: "Enux9GbTRpyzDhhP",
                },
                {
                    urls: "turns:global.relay.metered.ca:443?transport=tcp",
                    username: "beba88570d66f4cc9406abc9",
                    credential: "Enux9GbTRpyzDhhP",
                },
            ]
        }
    });

    peer.on('open', (id) => {
        console.log('Peer ID: ', id);
        if (createRoom) {
            chrome.runtime.sendMessage({
                event: ExtensionEvent.roomCreated,
                data: id
            });
        }
    });

    peer.on('connection', (conn) => {
        console.log('Peer connected: ', conn.peer);
        connection = conn;
        conn.on('data', (data) => {
            console.log('Received data: ', data);
        });
    });

    peer.on('error', (err) => {
        console.error('Peer error: ' + err.message);
    });

    peer.on('close', () => {
        console.log('Peer connection closed');
    });

    peer.on('disconnected', () => {
        console.log('Peer disconnected');
    });

    return peer;
}

function connectToPeer(peer: Peer, peerIdToConnect: string) {
    let conn: DataConnection  = peer.connect(peerIdToConnect);
    console.log('Connecting to peer: ', peerIdToConnect + '...');

    conn.on('open', () => {
        console.log('Connection opened with peer: ', peerIdToConnect);
        conn.send('hi!');
        chrome.runtime.sendMessage({ event: ExtensionEvent.roomJoined, data: peerIdToConnect });
    });

    conn.on('data', (data) => {
        console.log('Received data: ', data);
        if (data == 'pause') {
            console.log('Received pause command');
            externalCommand = true;
            video.pause();
            externalCommand = false
        }
    });

    conn.on('close', () => {
        console.log('Connection closed with peer: ', peerIdToConnect);
    });

    conn.on('error', (err) => {
        console.error('Connection error with peer: ', peerIdToConnect, 'Error: ', err.message);
    });
    return conn;
}


if (video) {
    video.addEventListener('play', () => {
        console.log('Video started');
        // Send message to background to synchronize playback
        chrome.runtime.sendMessage({ action: 'syncPlayback', status: 'play' });
    });

    video.addEventListener('pause', () => {
        console.log('Video paused');
        if (!externalCommand) {
            connection.send(CommunicationEvent.pause);
        }
    });

    video.addEventListener('waiting', () => {
        console.log('Video buffering');
        chrome.runtime.sendMessage({ action: 'syncPlayback', status: 'buffering' });
    });
}

function sleep(milliseconds: number): void {
    const start = new Date().getTime();
    while (new Date().getTime() - start < milliseconds) {
        // Busy-wait loop
    }
}
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
   if (message.event === ExtensionEvent.createRoom) {
       peer = peerFactory(true);
   } else if (message.event === ExtensionEvent.joinRoom) {
       peer = peerFactory();
       setTimeout(() => {
           connection = connectToPeer(peer, message.data);
       }, 3000);
   }
});

window.addEventListener('beforeunload', function(event) {
    chrome.runtime.sendMessage({event: ExtensionEvent.leaveRoom});
});