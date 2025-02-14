const ws_tout = 1000;

export default class WS {
    init(url, port) {
        this.ip = url.split('//')[1];
        this.port = port;
    }
    open() {
        this.reconnect = true;
        this.ws = new WebSocket(`ws://${this.ip}:${this.port}/`, ['sets']);
        this.ws.binaryType = "arraybuffer";

        let lws = this.ws;
        let timeout = setTimeout(() => lws.close(), ws_tout);

        this.ws.onopen = () => {
            clearTimeout(timeout);
            this.online = true;
            this.onchange(true);
        }

        this.ws.onclose = () => {
            clearTimeout(timeout);
            this.ws = null;
            this.online = false;
            setTimeout(() => this.open(), ws_tout);
            this.onchange(false);
        }

        this.ws.onmessage = (e) => {
            this.ondata(new Uint8Array(e.data));
        }
    }
    reset() {
        this.online = false;
        if (!this.reconnect) return;
        if (this.ws) this.ws.close();
        this.onchange(false);
    }
    send(data) {
        if (this.online) this.ws.send(data);
    }
    connected() {
        return this.online;
    }
    // close - this.reconnect = false;

    onchange(state) { }
    ondata() { }
}