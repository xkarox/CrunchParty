document.getElementById('createRoom')?.addEventListener('click', () => {
    console.log('Create Room clicked');
    chrome.runtime.sendMessage({ action: 'createRoom' });
});

document.getElementById('joinRoom')?.addEventListener('click', () => {
    console.log('Join Room clicked');
    // Logic to join a room
});