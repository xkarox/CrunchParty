const video = document.querySelector('video') as HTMLVideoElement;

if (video) {
    video.addEventListener('play', () => {
        console.log('Video started');
        // Send message to background to synchronize playback
        chrome.runtime.sendMessage({ action: 'syncPlayback', status: 'play' });
    });

    video.addEventListener('pause', () => {
        console.log('Video paused');
        chrome.runtime.sendMessage({ action: 'syncPlayback', status: 'pause' });
    });

    video.addEventListener('waiting', () => {
        console.log('Video buffering');
        chrome.runtime.sendMessage({ action: 'syncPlayback', status: 'buffering' });
    });
}