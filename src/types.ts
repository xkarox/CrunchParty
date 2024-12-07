export enum CommunicationEvent {
    play = "play",
    pause = "pause",
    timeUpdate = "timeUpdate",
    buffering = "buffering",
}

export enum ExtensionEvent {
    createRoom = "createRoom",
    roomCreated = "roomCreated",
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