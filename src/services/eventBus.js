/**
 * Lightweight internal event bus for widget ↔ widget communication.
 * Supports cross-filtering and drill-down events without coupling widgets.
 */
class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event.
   * @param {string} event
   * @param {Function} callback
   * @returns {() => void} unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event with payload.
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    this.listeners.get(event)?.forEach((cb) => {
      try {
        cb(data);
      } catch (err) {
        console.error(`[EventBus] Error in listener for "${event}":`, err);
      }
    });
  }

  /**
   * Remove all listeners for an event (or all events).
   * @param {string} [event]
   */
  off(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

export const eventBus = new EventBus();

/* Standard event names */
export const EVENTS = {
  CROSS_FILTER: 'cross:filter',
  DRILL_DOWN: 'drill:down',
  WIDGET_ACTION: 'widget:action',
  AGENT_RESPONSE: 'agent:response',
  DASHBOARD_REFRESH: 'dashboard:refresh',
};
