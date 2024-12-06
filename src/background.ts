chrome.runtime.onInstalled.addListener(() => {
    console.log("Crunchyroll Sync Extension installed.");
});

// Listen for messages from the content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'createRoom') {
        console.log("Creating a new room");
        // Room creation logic
    }
});