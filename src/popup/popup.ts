import {RoomControlEvent, RoomControlMessage} from "../shared/types";

console.log("CrunchParty popup script running.");

const createRoomButton =
    document.getElementById('createRoom');
const joinRoomButton =
    document.getElementById('joinRoom');
const roomIDInput =
    document.getElementById('joinRoomId');
const userCount =
    document.getElementById('userCount');
const currentRoomDiv =
    document.getElementById('currentRoom');
const roomID =
    document.getElementById('roomId');
const connectionStatus =
    document.getElementById('connectionStatus')

createRoomButton?.addEventListener('click', () => {
    console.log("createRoomButton clicked");
    const message: RoomControlMessage = {
        event: RoomControlEvent.roomInitiateCreation
    }
    chrome.runtime.sendMessage(message,
        (response: RoomControlMessage) => {});
});

joinRoomButton?.addEventListener('click', () => {
    const message: RoomControlMessage = {
        event: RoomControlEvent.roomInitiateJoin,
        data: (roomIDInput as HTMLInputElement)?.value
    }
    chrome.runtime.sendMessage(message,
        (response: RoomControlMessage) => {});
});

document.addEventListener('DOMContentLoaded', () => {
    const message: RoomControlMessage = {
        event: RoomControlEvent.roomIdRequest
    }
    chrome.runtime.sendMessage(message,
        (response: RoomControlMessage) => {});
});

chrome.runtime.onMessage.addListener(
    (message: RoomControlMessage, sender, sendResponse) => {
        console.log("Message received in popup script: ", message);
    switch (message.event) {
        case RoomControlEvent.roomCreationSucceeded:
            roomID!.textContent = message.data as string;
            currentRoomDiv!.classList.remove('hidden');
            connectionStatus!.classList.add('connected');
            break
        case RoomControlEvent.roomIdLookupSucceeded:
            roomID!.textContent = message.data as string;
            currentRoomDiv!.classList.remove('hidden');
            connectionStatus!.classList.add('connected');
            break;
        case RoomControlEvent.roomJoinSucceeded:
            roomID!.textContent = message.data as string;
            currentRoomDiv!.classList.remove('hidden');
            connectionStatus!.classList.add('connected');
            break;
        default:
            break;
    }
});