import { ChatMessage } from "../types/Chat";
import { getWebSocketURL } from "../lib/config";

export class ChatSocket {
  private socket: WebSocket;
  private onMessage: (msg: ChatMessage) => void;
  private sendQueue: ChatMessage[] = [];
  private isOpen = false;

  constructor(
    roomId: string,
    onMessage: (msg: ChatMessage) => void,
    onOpen?: () => void
  ) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
    const wsUrl = `${getWebSocketURL()}?roomId=${roomId}${
      token ? `&token=${token}` : ""
    }`;
    this.socket = new WebSocket(wsUrl);
    this.onMessage = onMessage;

    this.socket.onopen = () => {
      this.isOpen = true;
      console.log("WebSocket connection established.");
      // 큐에 쌓인 메시지 모두 전송
      this.sendQueue.forEach((msg) => this.send(msg));
      this.sendQueue = [];
      // onOpen 콜백이 있으면 실행
      if (onOpen) {
        onOpen();
      }
    };

    this.socket.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      this.onMessage(data);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      this.isOpen = false;
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.error('Connection died');
      }
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