import { io } from 'socket.io-client';
import { useStore } from '../store/useStore';
import { eventBus, EVENTS } from './eventBus';

/**
 * WebSocket service that connects to the Agent Gateway server.
 * Handles connection lifecycle and routes incoming agent responses
 * through the global store and event bus.
 */
class SocketService {
  constructor() {
    /** @type {import('socket.io-client').Socket|null} */
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  /**
   * Connect to the Agent Gateway.
   * @param {string} [url] - Gateway URL (defaults to localhost:4000)
   */
  connect(url = 'http://localhost:4000') {
    if (this.socket?.connected) return;

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to Agent Gateway');
      useStore.getState().setConnected(true);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      useStore.getState().setConnected(false);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
      this.reconnectAttempts++;
      useStore.getState().setConnected(false);
    });

    /* Agent sends a visualization response */
    this.socket.on('agent:response', (payload) => {
      console.log('[Socket] Agent response received:', payload.viz_type);
      useStore.getState().addResponse(payload);
      eventBus.emit(EVENTS.AGENT_RESPONSE, payload);
    });

    /* Agent sends a full dashboard spec */
    this.socket.on('agent:dashboard', (spec) => {
      console.log('[Socket] Dashboard spec received:', spec.title);
      const layout = spec.layout?.rows?.flatMap((row, ri) =>
        row.widgets.map((wid, ci) => {
          const widget = spec.widgets.find((w) => w.id === wid);
          return {
            i: wid,
            x: ci * (widget?.span || 6),
            y: ri * (row.height || 4),
            w: widget?.span || 6,
            h: row.height || 4,
            minW: 3,
            minH: 2,
          };
        })
      ) || [];
      useStore.getState().setDashboard(spec.widgets, layout);
    });

    /* Agent streams partial data */
    this.socket.on('agent:stream', (chunk) => {
      eventBus.emit('agent:stream', chunk);
    });
  }

  /**
   * Send a message to the agent gateway.
   * @param {string} event
   * @param {*} data
   */
  send(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('[Socket] Not connected, cannot send:', event);
    }
  }

  /**
   * Send a user action (e.g., button click on a widget).
   * @param {object} action
   */
  sendAction(action) {
    this.send('user:action', action);
  }

  /**
   * Send a natural language query.
   * @param {string} query
   * @param {object} [context]
   */
  sendQuery(query, context = {}) {
    this.send('user:query', { query, context });
  }

  /**
   * Disconnect from the gateway.
   */
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    useStore.getState().setConnected(false);
  }
}

export const socketService = new SocketService();
