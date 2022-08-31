export interface ISocket {
  connect(): void;
  disconnect(): void;
  onMessage(message: string): void;
  sendMessage(message: string, data: any): void;
}
