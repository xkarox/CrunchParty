import {DataConnection} from "peerjs";
import {MediaPlayerEvent, MediaSyncMessage} from "../../shared/types";
import {VideoController} from "../video/VideoController";

export class SyncHandler{
    private connection: DataConnection | null = null;
    private videoController: VideoController | null = null;

    constructor(connection?: DataConnection){
        this.setConnection(connection || null);
    }

    public setConnection(connection: DataConnection | null){
        this.connection = connection;
        this.setupConnectionEvents();
    }

    public sendPlaybackStart(currentTime: number){
        if (this.connection){
            const message: MediaSyncMessage =
                {
                    event: MediaPlayerEvent.playbackStart,
                    data: currentTime
                };
            this.connection.send(message);
        }
    }

    public sendPlaybackPause(currentTime: number){
        if (this.connection){
            const message: MediaSyncMessage =
                {
                    event: MediaPlayerEvent.playbackPause,
                    data: currentTime
                };
            this.connection.send(message);
        }
    }

    public sendPlaybackPositionChanged(currentTime: number){
        if (this.connection) {
            const message: MediaSyncMessage =
                {
                    event: MediaPlayerEvent.playbackPositionChanged,
                    data: currentTime
                };
            this.connection.send(message);
        }
    }

    public sendPlaybackBuffering(){
        if (this.connection) {
            const message: MediaSyncMessage =
                {
                    event: MediaPlayerEvent.playbackBuffering
                };
            this.connection.send(message);
        }
    }

    public sendPlaybackSeekCompleted(currentTime: number){
        if (this.connection) {
            const message: MediaSyncMessage =
                {
                    event: MediaPlayerEvent.playbackSeekCompleted,
                    data: currentTime
                };
            this.connection.send(message);
        }
    }


    public registerVideoController(videoController: VideoController){
        this.videoController = videoController;
    }

    private setupConnectionEvents(){
        console.log(this.connection)
        if (this.connection){
            this.connection.on('data', (data) => {
                console.log('data handler')
                const message = data as MediaSyncMessage;
                this.handleSyncMessage(message);
            });
        }
    }

    private handleSyncMessage(message: MediaSyncMessage){
        console.log("handleSyncMessage");
        switch (message.event){
            case MediaPlayerEvent.playbackStart:
                this.videoController?.play();
                break;
            case MediaPlayerEvent.playbackPause:
                this.videoController?.pause();
                break;
            case MediaPlayerEvent.playbackPositionChanged:
                this.videoController?.seekTo(message.data as number);
                break;
            case MediaPlayerEvent.playbackBuffering:
                this.videoController?.buffering();
                break;
            case MediaPlayerEvent.playbackSeekCompleted:
                this.videoController?.seekTo(message.data as number);
                break;
        }
    }
}