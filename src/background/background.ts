import {RoomControlEvent} from "../shared/types";
import Tab = chrome.tabs.Tab;
import {StorageService} from "../services/StorageService";

console.log("CrunchParty background script running.");
const queryOptions = {
    active: true,
    lastFocusedWindow: true,
    url: "https://www.crunchyroll.com/*"
};

async function getCrunchyrollTab(): Promise<Tab> {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(queryOptions, (tabs) => {
            let tab = tabs[0];
            if (tab) {
                resolve(tab);
            } else {
                reject("No Crunchyroll tab found.");
            }
        });
    });
}

async function handleRoomCreation() {
    console.log("Creating room...");
    getCrunchyrollTab().then((tab) => {
        console.log("Sending message to tab: ", tab);
        chrome.tabs.sendMessage(tab.id!, {event: RoomControlEvent.roomInitiateCreation});
    }).catch((err) => {
        console.error("Failed to create room: ", err);
    })
}

async function handleRoomJoin(roomId: string) {
    console.log("Joining room...");
    getCrunchyrollTab().then((tab) => {
        chrome.tabs.sendMessage(tab.id!, {
            event: RoomControlEvent.roomInitiateJoin,
            data: roomId
        });
    }).catch((err) => {
        console.error("Failed to join room: ", err);
    });
}

async function handleRoomIdRequest() {
    console.log("Requesting room ID...");
    getCrunchyrollTab().then((tab) => {
        chrome.tabs.sendMessage(tab.id!, {event: RoomControlEvent.roomIdRequest});
    }).catch((err) => {
        console.error("Failed to request room ID: ", err);
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("CrunchParty installed.");
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Message received in background script: ", message);
    switch (message.event) {
        // Incoming messages from the popup
        case RoomControlEvent.roomInitiateCreation: {
            handleRoomCreation().then(() => {});
            break;
        }
        case RoomControlEvent.roomInitiateJoin:
            handleRoomJoin(message.data).then(() => {});
            break;
        case RoomControlEvent.roomIdRequest: {
            let roomId = await StorageService.get<string>("roomId");
            if (roomId) {
                chrome.runtime.sendMessage({
                    event: RoomControlEvent.roomIdLookupSucceeded,
                    data: roomId
                }).then(() => {});
                break;
            }
            handleRoomIdRequest().then(() => {
            });
            break;
        }
        // Incoming messages from the content script
        case RoomControlEvent.roomCreationSucceeded:
            await StorageService.set<string>("roomId", message.data);
            chrome.runtime.sendMessage(message).then(() => {});
            break;
        case RoomControlEvent.roomJoinSucceeded:
            await StorageService.set<string>("roomId", message.data);
            chrome.runtime.sendMessage(message).then(() => {});
            break;
        case RoomControlEvent.roomIdLookupSucceeded:
            chrome.runtime.sendMessage(message).then(() => {});
            break;
        default:
            break;
    }
});