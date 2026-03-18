export interface SocketPort {
  connect(): void;
  disconnect(): void;
  emit(event: string, data: unknown): void;
  on(event: string, callback: (data: unknown) => void): void;
  off(event: string, callback?: (data: unknown) => void): void;
  getSocketId(): string | undefined;
  isConnected(): boolean;
  getRawSocket(): any;
}