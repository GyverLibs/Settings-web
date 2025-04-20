import { encodeText, hash } from "@alexgyver/utils";
import WS from "./websocket";

const U8 = (d) => new Uint8Array(d);
const U16 = (d) => new Uint16Array(d);
const U32 = (d) => new Uint32Array(d);

export default class WSRequest {
    constructor() {
        this.queue = {};
        this.pid = Math.random() * 65535 | 0;

        this.ws = new WS();

        this.ws.ondata = (data) => {
            let len = data.length;
            if (len < 3) return;
            let pid = U16(data.slice(len - 2, len).buffer)[0];
            let skip = data.slice(len - 3, len - 2)[0];
            let bin = data.slice(0, len - 3);
            if (pid in this.queue) this.queue[pid](skip ? U8([]) : bin);
            else this.ondata(bin);
        }
    }

    init(url, port) {
        if (this.opened) return;
        this.ws.init(url, port, 'sets');
        this.ws.open();
        this.opened = true;
    }

    clear() {
        this.queue = {};
    }

    async request(auth, action, id, value, tout) {
        if (++this.pid >= 65536) this.pid = 1;
        let curpid = this.pid;
        this.ws.send(U8([...U8(U16([curpid]).buffer), ...U8(U32([auth, hash(action), id]).buffer), ...encodeText(value ?? '')]));

        return new Promise(res => {
            let t = setTimeout(() => {
                delete this.queue[curpid];
                res(null);
            }, tout);

            this.queue[curpid] = (data) => {
                delete this.queue[curpid];
                clearTimeout(t);
                res(data);
            }
        });
    }

    ondata(data) { }
}