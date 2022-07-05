import io from 'socket.io-client';
import { ISocket } from './ISocket';

export class Socket implements ISocket {
  private socket: any;
  private isChartConnected: boolean;

  constructor(ip: string) {
    this.socket = io(ip);
    this.isChartConnected = false;
  }

  connect() {
    this.socket.on('connect', () => {
      this.isChartConnected = true;
    });
  }

  disconnect() {
    if (!this.isChartConnected) return;
    this.socket.on('disconnect', () => {
      this.isChartConnected = false;
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
    if (this.isChartConnected) this.socket.emit(message, data);
  }
}
