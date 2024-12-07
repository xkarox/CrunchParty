import {ExtensionEvent, Message} from "./types";


console.log("CrunchParty background script running.");

chrome.runtime.onInstalled.addListener(() => {
    console.log("CrunchParty installed.");
});

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message received in background script: ", message);

    if (message.event === ExtensionEvent.createRoom) {
        console.log("Create Room message received. Creating room...");
        let queryOptions = { active: true, lastFocusedWindow: true, url: "https://www.crunchyroll.com/*" };
        chrome.tabs.query(queryOptions, (tabs) => {
            let tab = tabs[0];
            if (tab) {
                chrome.tabs.sendMessage(tab.id!, { event: ExtensionEvent.createRoom })
            }
        });
    }
    else if (message.event === ExtensionEvent.roomCreated) {
        console.log("Room created successfully background");
        chrome.storage.local.set({roomId: message.data})
        chrome.runtime.sendMessage({ event: message.event, data: message.data });

    } else if (message.event === ExtensionEvent.requestRoomId) {
        console.log("Request Room ID message received. Sending room ID...");
        try {
            chrome.storage.local.get('roomId', (result) => {
                console.log("Room ID: ", result.roomId);
                chrome.runtime.sendMessage({ event: ExtensionEvent.roomIdFound, data: result.roomId });
            });
        } catch {
            sendResponse({ event: ExtensionEvent.roomIdNotFound, data: null });
        }
    } else {
        console.log("Unknown message type: ", message);
    }

});
