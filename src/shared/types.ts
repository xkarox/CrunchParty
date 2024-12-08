//  external

export enum MediaPlayerEvent {
    playbackStart = "playbackStart",
    playbackPause = "playbackPause",
    playbackPositionChanged = "playbackPositionChanged",
    playbackBuffering = "playbackBuffering",
    playbackSeekCompleted = "playbackSeekCompleted"
}
export type MediaSyncMessage = {
    event: MediaPlayerEvent;
    data?: unknown;
}

// internal
export enum RoomControlEvent {
    roomInitiateCreation = "roomInitiateCreation",
    roomCreationSucceeded = "roomCreationSucceeded",
    roomInitiateJoin = "roomInitiateJoin",
    roomJoinSucceeded = "roomJoinSucceeded",
    roomInitiateLeave = "roomInitiateLeave",
    roomLeaveSucceeded = "roomLeaveSucceeded",
    roomIdRequest = "roomIdRequest",
    roomIdLookupSucceeded = "roomIdLookupSucceeded"
}
export type RoomControlMessage = {
    event: RoomControlEvent;
    data?: unknown;
}

