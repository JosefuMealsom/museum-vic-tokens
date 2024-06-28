import { Socket, io } from "socket.io-client";

export default class SocketIoService {
  host: string;
  port: number;
  socket?: Socket;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  connect() {
    this.socket = io(`${this.host}:${this.port}`);
  }

  on(messageName: string, callback: (data: any) => any) {
    this.socket?.on(messageName, (data) => {
      callback(data);
    });
  }
}
