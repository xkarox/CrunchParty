export enum CommunicationEvent {
    play = "play",
    pause = "pause",
    timeUpdate = "timeUpdate",
    buffering = "buffering",
    seeked = "seeked",
}

export enum ExtensionEvent {
    createRoom = "createRoom",
    roomCreated = "roomCreated",
    joinRoom = "joinRoom",
    roomJoined = "roomJoined",
    leaveRoom = "leaveRoom",
    roomLeft = "roomLeft",
    requestRoomId = "requestId",
    roomIdNotFound = "roomIdNotFound",
    roomIdFound = "roomIdFound",
}

export type Message = {
    event: ExtensionEvent,
    data?: any
}

export type SyncMessage = {
    event: CommunicationEvent,
    data?: any;
}