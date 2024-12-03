export class WebSocketClient {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
      this.socket = null;
      this.messageHandlers = new Map();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
    }
  
    connect(sessionId) {
      return new Promise((resolve, reject) => {
        try {
          this.socket = new WebSocket(`${this.baseUrl}/ws?sessionId=${sessionId}`);
          
          this.socket.onopen = () => {
            this.reconnectAttempts = 0;
            resolve();
          };
  
          this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const handlers = this.messageHandlers.get(message.type);
            if (handlers) {
              handlers.forEach(handler => handler(message.data));
            }
          };
  
          this.socket.onclose = this.handleDisconnect.bind(this);
          this.socket.onerror = () => {
            if (!this.socket.isConnected) {
              reject(new Error('WebSocket connection failed'));
            }
          };
  
        } catch (error) {
          reject(error);
        }
      });
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  
    send(type, data) {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type, data }));
      }
    }
  
    on(messageType, handler) {
      if (!this.messageHandlers.has(messageType)) {
        this.messageHandlers.set(messageType, new Set());
      }
      this.messageHandlers.get(messageType).add(handler);
      
      return () => {
        const handlers = this.messageHandlers.get(messageType);
        if (handlers) {
          handlers.delete(handler);
        }
      };
    }
  
    async handleDisconnect(event) {
      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, this.reconnectAttempts)));
        this.connect();
      }
    }
  }