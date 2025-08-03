export class MockWebSocket {
    static singletonOnopen: (() => void) | null = null;
    static singletonOnmessage: ((event: MessageEvent) => void) | null = null;
    static singletonOnclose: ((event: CloseEvent) => void) | null = null;
    static singletonOnerror: (() => void) | null = null;

    set onopen(callback: () => void) {
        MockWebSocket.singletonOnopen = callback;
    }

    set onmessage(callback: (event: MessageEvent) => void) {
        MockWebSocket.singletonOnmessage = callback;
    }

    set onclose(callback: (event: CloseEvent) => void) {
        MockWebSocket.singletonOnclose = callback;
    }

    set onerror(callback: () => void) {
        MockWebSocket.singletonOnerror = callback;
    }

    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;

    static readyState = MockWebSocket.CONNECTING;

    static messages: string[] = [];

    triggerOpen() {
        MockWebSocket.readyState = MockWebSocket.OPEN;
        MockWebSocket.singletonOnopen?.();
    }

    triggerMessage(data: unknown) {
        MockWebSocket.singletonOnmessage?.({ data } as MessageEvent);
    }

    triggerClose(code = 1000) {
        MockWebSocket.readyState = MockWebSocket.CLOSED;
        MockWebSocket.singletonOnclose?.({ code } as CloseEvent);
    }

    triggerError() {
        MockWebSocket.singletonOnerror?.();
    }

    close() {
        MockWebSocket.readyState = MockWebSocket.CLOSING;
        setTimeout(() => {
            MockWebSocket.readyState = MockWebSocket.CLOSED;
        }, 10);
    }

    send(message: string) {
        MockWebSocket.messages.push(message);
    }
}
