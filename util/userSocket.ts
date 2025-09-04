import { getWebSocketURL } from "../lib/config";
import { ACCESS_TOKEN } from "@/constants/global";
import { refreshAccessToken } from "@/lib/api/apiClient";

export class UserSocket {
  private socket: WebSocket | undefined = undefined;
  private onMessage: (msg: any) => void;

  constructor(onMessage: (msg: any) => void) {
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    const token = typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : "";
    const chatWsUrl = getWebSocketURL();
    const baseWsUrl = chatWsUrl.substring(0, chatWsUrl.lastIndexOf("/"));
    const wsUrl = `${baseWsUrl}/user?${token ? `token=${token}` : ""}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => console.log("User WebSocket connection established.");

    this.socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'unauthorized') {
          console.warn('User WebSocket unauthorized. Refreshing token...');
          try {
            await refreshAccessToken();
            this.close();
            this.connect();
          } catch (e) {
            console.error("Failed to refresh token for User WebSocket", e);
          }
          return;
        }
        this.onMessage(data);
      } catch (error) {
        console.error("Error parsing User WebSocket message", error);
      }
    };

    this.socket.onerror = (error) => console.error("User WebSocket error:", error);
    this.socket.onclose = (event) => {
      console.log("User WebSocket connection closed:", event);
      if (!event.wasClean) console.error('User WebSocket connection died');
    };
  }

  public close() {
    if (this.socket) {
      console.log("Closing User WebSocket.");
      this.socket.onclose = null;
      this.socket.close();
      this.socket = undefined;
    }
  }
}