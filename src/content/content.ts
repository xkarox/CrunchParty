import {PeerService} from "../services/PeerService";
import {VideoController} from "./video/VideoController";
import {SyncHandler} from "./sync/SyncHandler";
import {RoomControlEvent, RoomControlMessage} from "../shared/types";
import {StorageService} from "../services/StorageService";

console.log('CrunchParty content script running.');
StorageService.clear()
function getVideo(): HTMLVideoElement {
    console.log('Looking for video element...');
    let video =  document.querySelector('video') as HTMLVideoElement;
    if (!video) {
        setInterval(() => {
            video = document.querySelector('video') as HTMLVideoElement;
        }, 1000);
        console.error("No video element found on the page.");
    }
    console.log('Video element found.');
    return video;
}

let video: HTMLVideoElement = getVideo();
let peerService: PeerService;
let syncHandler: SyncHandler;
let videoController: VideoController;

function handleRoomCreation() {
    peerService = new PeerService();
    peerService.createRoom().then((roomId) => {
        syncHandler = new SyncHandler(peerService.getConnection());
        peerService.setConnectionRefreshCallback(syncHandler.setConnection)
        videoController = new VideoController(video, syncHandler);
        chrome.runtime.sendMessage(
            {
                event: RoomControlEvent.roomCreationSucceeded,
                data: roomId
            });
    }).catch((err) => {
        console.error('Failed to create room: ', err.message);
    });
}

function handleRoomJoin(roomId: string) {
    console.log('Joining room: ', roomId);
    peerService = new PeerService();
    // Add delay before connection attempt
    setTimeout(() => {
        peerService.joinRoom(roomId).then(() => {
            syncHandler = new SyncHandler(peerService.getConnection());
            peerService.setConnectionRefreshCallback(syncHandler.setConnection)
            videoController = new VideoController(video, syncHandler);
            chrome.runtime.sendMessage({
                event: RoomControlEvent.roomJoinSucceeded,
                data: roomId
            });
        }).catch((err) => {
            console.error('Failed to join room: ', err.message);
        });
    }, 3000);
}

function handleRoomLeave() {
    peerService.leaveRoom().then(() => {
        chrome.runtime.sendMessage(
            {
                event: RoomControlEvent.roomLeaveSucceeded
            });
    }).catch((err) => {
        console.error('Failed to leave room: ', err.message);
    });
}

function handleRoomIdRequest() {
    if (peerService) {
        const roomId = peerService.getRoom();
        chrome.runtime.sendMessage(
            {
                event: RoomControlEvent.roomIdLookupSucceeded,
                data: roomId
            });
    }

}

chrome.runtime.onMessage.addListener(
    async (message: RoomControlMessage,
     sender: chrome.runtime.MessageSender,
     sendResponse) => {
    console.log('Message received in content script: ', message);
    switch (message.event) {
        case RoomControlEvent.roomInitiateCreation:
            handleRoomCreation();
            break;
        case RoomControlEvent.roomInitiateJoin:
            handleRoomJoin(message.data as string);
            break;
        case RoomControlEvent.roomInitiateLeave:
            handleRoomLeave();
            break;
        case RoomControlEvent.roomIdRequest:
            handleRoomIdRequest();
            break;
        default:
            break;
    }
});