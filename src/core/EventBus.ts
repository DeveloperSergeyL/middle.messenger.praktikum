type Listener<T extends unknown[] = unknown[]> = (...args: T) => void;

export default class EventBus {
    private listeners: Record<string, Listener[]> = {};

    public on<T extends unknown[] = unknown[]>(
        event: string,
        callback: Listener<T>
    ): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback as Listener);
    }

    public off<T extends unknown[] = unknown[]>(
        event: string,
        callback: Listener<T>
    ): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event] = this.listeners[event].filter(
            (listener) => listener !== callback
        );
    }

    public emit<T extends unknown[] = unknown[]>(
        event: string,
        ...args: T
    ): void {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach((listener) => {
            listener(...args);
        });
    }
}
