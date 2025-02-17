import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL || 'ws://localhost:3000';

let socketInstance: Socket | null = null;

export function initializeSocket(): Socket {
  if (socketInstance) return socketInstance;

  socketInstance = io(SOCKET_SERVER_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 5000,
  });

  socketInstance.on('connect', () => {
    console.log(`Connected to master socket server with ID: ${socketInstance?.id}`);
  });

  socketInstance.on('disconnect', () => {
    console.log('Disconnected from master socket server');
  });

  socketInstance.on('scraper_complete', (data: any) => {
    console.log('Received scraper completion data:', data);
  });

  return socketInstance;
}

export function getSocket(): Socket {
  if (!socketInstance) {
    throw new Error('Socket not initialized. Call initializeSocket() first.');
  }
  return socketInstance;
}
