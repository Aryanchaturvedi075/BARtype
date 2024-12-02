// frontend/src/lib/services/websocket.js               --> WebSocket Client Service for Real-Time Communication
export class WebSocketClient {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.handlers = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.url);

            // Bind all event handlers
            this.ws.onmessage = this.handleMessage.bind(this);
            this.ws.onclose = this.handleClose.bind(this);
            this.ws.onerror = (error) => {
                this.handleError(error);
                reject(new Error('WebSocket connection failed'));
            };

            // Set timeout for connection attempt
            const connectionTimeout = setTimeout(() => {
                reject(new Error('WebSocket connection timeout'));
            }, 5000);

            // Clear timeout if connection succeeds
            this.ws.onopen = () => {
                clearTimeout(connectionTimeout);
                this.reconnectAttempts = 0;
                resolve();
            };
        });
    }

    handleMessage(event) {
        try {
            const message = JSON.parse(event.data);
            const handlers = this.handlers.get(message.type);
            if (handlers) {
                handlers.forEach(handler => handler(message.data));
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    handleClose(event) {
        if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectAttempts));
        }
    }

    handleError(error) {
        console.error('WebSocket error:', error);
        const errorHandlers = this.handlers.get('error');
        if (errorHandlers) {
            errorHandlers.forEach(handler => handler(error));
        }
    }

    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }
        this.handlers.get(eventType).add(handler);

        return () => {
            this.handlers.get(eventType).delete(handler);
        };
    }

    send(type, data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, ...data }));
        } else {
            throw new Error('WebSocket is not connected');
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}