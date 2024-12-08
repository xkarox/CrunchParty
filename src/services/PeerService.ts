import Peer, {DataConnection, PeerOptions} from "peerjs";

export class PeerService {
    private peer: Peer | undefined;
    private connection: DataConnection | undefined;
    private readonly config: PeerOptions | undefined;
    private room: string | undefined;
    private connectionRefreshCallback: ((connection: DataConnection | null) => void) | undefined;

    constructor(config?: PeerOptions) {
        this.config = config || {
            host: '0.peerjs.com',
            port: 443,
            debug: 0,
            config: {
                'iceServers':
                    [
                        {
                            urls: "stun:stun.relay.metered.ca:80",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:80",
                            username: "beba88570d66f4cc9406abc9",
                            credential: "Enux9GbTRpyzDhhP",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:80?transport=tcp",
                            username: "beba88570d66f4cc9406abc9",
                            credential: "Enux9GbTRpyzDhhP",
                        },
                        {
                            urls: "turn:global.relay.metered.ca:443",
                            username: "beba88570d66f4cc9406abc9",
                            credential: "Enux9GbTRpyzDhhP",
                        },
                        {
                            urls: "turns:global.relay.metered.ca:443?transport=tcp",
                            username: "beba88570d66f4cc9406abc9",
                            credential: "Enux9GbTRpyzDhhP",
                        },
                    ]
            }
        };
        this.peer = this.peerFactory(this.config);
    }

    async createRoom(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.peer && this.config) {
                this.peer = this.peerFactory(this.config);
            }
            if (this.peer) {
                this.peer.on('open', (id: string): void => {
                    console.log('Peer ID: ', id);
                    resolve(id);
                });
            } else {
                reject(new Error('Failed to create room'));
            }
        });
    }

    async joinRoom(roomId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.peer && this.config) {
                this.peer = this.peerFactory(this.config);
            }
            if (this.peer) {
                console.log('Connecting to room: ', roomId);
                const conn = this.peer.connect(roomId);

                // Add error handling for the connection
                conn.on('error', (err) => {
                    reject(err);
                });

                // // Add timeout in case connection never opens
                // setTimeout(() => {
                //     reject(new Error('Connection timeout'));
                // }, 10000);

                conn.on('open', () => {
                    console.log('Connected to room: ', roomId);
                    this.connection = this.configureConnectionEvents(conn);
                    resolve();
                });
            } else {
                reject(new Error('Failed to connect to room'));
            }
        });
    }

    async leaveRoom(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.connection) {
                this.connection.close();
                this.connection = undefined;
                resolve();
            } else {
                reject(new Error('No connection to close'));
            }
        });
    }

    public getConnection(): DataConnection | undefined {
        return this.connection;
    }

    public getRoom(): string | undefined {
        return this.connection? this.connection.connectionId : undefined;
    }

    peerFactory(config: PeerOptions): Peer {
        return this.configurePeerEvents(new Peer(config));
    }

    configurePeerEvents(peer: Peer): Peer {
        peer.on('connection', (conn: DataConnection): void => {
            console.log('New Peer connected: ', conn.peer);
            this.connection = conn;
            this.connection.on('data', (data) => {
                console.log('Received data: ', data);
            });
        });

        peer.on('error', (err): void => {
            console.error('Peer error: ' + err.message);
        });

        peer.on('close', (): void => {
            console.log('Peer connection closed');
        });

        peer.on('disconnected', (): void => {
            console.log('Peer disconnected');
        });

        return peer;
    }

    configureConnectionEvents(conn: DataConnection): DataConnection {
        conn.on('data', (data) => {
            console.log('Badly Received data: ', data);
        })

        conn.on('close', (): void => {
            console.log('Connection closed with peer: ', conn.peer);
        });

        conn.on('error', (err) => {
            console.error('Error: ', err.message);
        });

        return conn;
    }

    public setConnectionRefreshCallback(callback: (connection: DataConnection | null) => void) {
        this.connectionRefreshCallback = callback;
    }
}