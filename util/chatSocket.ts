import { ChatMessage } from "../types/Chat";

export class ChatSocket {
  private socket: WebSocket;
  private onMessage: (msg: ChatMessage) => void;
  private sendQueue: ChatMessage[] = [];
  private isOpen = false;

  constructor(onMessage: (msg: ChatMessage) => void) {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    const wsUrl = `ws://localhost:8080/ws/chat?roomId=1${token ? `&token=${token}` : ""}`;
    this.socket = new WebSocket(wsUrl);
    this.onMessage = onMessage;

    this.socket.onopen = () => {
      this.isOpen = true;
      // 큐에 쌓인 메시지 모두 전송
      this.sendQueue.forEach((msg) => this.send(msg));
      this.sendQueue = [];
    };

    this.socket.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      this.onMessage(data);
    };
  }

  send(msg: ChatMessage) {
    if (this.isOpen && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      // 아직 연결 안 됐으면 큐에 저장
      this.sendQueue.push(msg);
    }
  }

  close() {
    this.socket.close();
  }
} 