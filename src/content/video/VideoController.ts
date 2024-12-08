import {SyncHandler} from "../sync/SyncHandler";

export class VideoController{
    private readonly videoElement: HTMLVideoElement;
    private syncHandler: SyncHandler | null = null;
    private externalCommand: boolean = false;

    constructor(videoElement: HTMLVideoElement, syncHandler? : SyncHandler){
        this.videoElement = videoElement;
        this.setSyncHandler(syncHandler || null);
    }

    public setSyncHandler(syncHandler: SyncHandler | null){
        this.syncHandler = syncHandler;
        this.syncHandler?.registerVideoController(this);
        this.configureEventListeners();
    }

    public toggleExternalCommand(){
        this.externalCommand = !this.externalCommand;
    }

    public play(){
        this.videoElement.play();
    }

    public pause(){
        this.videoElement.pause();
    }

    public buffering(){
        this.videoElement.pause();
    }

    public seekTo(time: number){
        this.videoElement.currentTime = time;
    }

    public getCurrentTime(){
        return this.videoElement.currentTime;
    }

    private configureEventListeners(){
        this.videoElement.addEventListener('play', () => {
            if (!this.syncHandler) {
                return;
            }
            if (!this.externalCommand){
                this.syncHandler.sendPlaybackStart(this.videoElement.currentTime);
            }
        })

        this.videoElement.addEventListener('pause', () => {
            if (!this.syncHandler) {
                return;
            }
            if (!this.externalCommand){
                this.syncHandler.sendPlaybackPause(this.videoElement.currentTime);
            }
        })

        this.videoElement.addEventListener('waiting', () => {
            if (!this.syncHandler) {
                return;
            }
            if (!this.externalCommand){
                this.syncHandler.sendPlaybackBuffering();
            }
        })

        this.videoElement.addEventListener('seeked', () => {
            if (!this.syncHandler) {
                return;
            }
            if (!this.externalCommand){
                this.syncHandler.sendPlaybackSeekCompleted(this.videoElement.currentTime);
            }
        })
    }

}