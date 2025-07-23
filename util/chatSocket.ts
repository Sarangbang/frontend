import { ChatMessage } from "../types/Chat";
import { getWebSocketURL } from "../lib/config";
import { ACCESS_TOKEN } from "@/constants/global";
import { refreshAccessToken } from "@/api/apiClient";

export class ChatSocket {
  private socket: WebSocket | undefined = undefined;
  private onMessage: ((msg: ChatMessage) => void) | undefined = undefined;
  private sendQueue: ChatMessage[] = [];
  private isOpen = false;

  constructor(
    roomId: string,
    onMessage: (msg: ChatMessage) => void,
    onOpen?: () => void
  ) {
    this.connect(roomId, onMessage, onOpen);
  }

  private connect(
    roomId: string,
    onMessage: (msg: ChatMessage) => void,
    onOpen?: () => void
  ) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : "";
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

    this.socket.onmessage = async (event) => {
      const data: ChatMessage | { type: string } = JSON.parse(event.data);
      // 401(unauthorized) 메시지 처리
      if (typeof data === 'object' && 'type' in data && data.type === 'unauthorized') {
        console.warn('WebSocket unauthorized. Refreshing token...');
        try {
          await refreshAccessToken();
          // 토큰 갱신 후 소켓 재연결
          this.close();
          this.connect(roomId, onMessage, onOpen);
        } catch (e) {
          // 토큰 갱신 실패 시: 로그아웃 등은 refreshAccessToken에서 처리됨
        }
        return;
      }
      if (this.onMessage) {
        this.onMessage(data as ChatMessage);
      }
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
    if (this.isOpen && this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      // 아직 연결 안 됐으면 큐에 저장
      this.sendQueue.push(msg);
    }
  }

  close() {
    if (this.socket) {
      console.log("소켓 제거")
      // this.socket.onopen = null;
      // this.socket.onmessage = null;
      // this.socket.onerror = null;
      // this.socket.onclose = null;
      this.socket.close();
      console.log(this.socket.readyState);
      // this.socket = undefined;
    }
  }
} 