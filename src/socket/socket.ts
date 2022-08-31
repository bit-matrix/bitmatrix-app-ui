import io from 'socket.io-client';
import { ISocket } from './ISocket';

export class Socket implements ISocket {
  private socket: any;
  private isConnected: boolean;

  constructor(ip: string) {
    this.socket = io(ip);
    this.isConnected = false;
  }

  connect() {
    this.socket.on('connect', () => {
      this.isConnected = true;
    });
  }

  disconnect() {
    if (!this.isConnected) return;
    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });
  }

  onMessage(message: string) {
    this.socket.on(message, (data: any) => {
      try {
        if (message === 'ping') {
          this.socket.emit('pong');
        } else {
          return data;
        }
      } catch {
        console.error(`Error onmessage: ${message}`);
      }
    });
  }

  sendMessage(message: string, data: any) {
    if (this.isConnected) this.socket.emit(message, data);
  }
}
