import { Config } from "./config";

export default class DelaySend {
    constructor(id, widget) {
        this.id = id;
        this.widget = widget;
    }
    send(value) {
        this.cache = value;

        if (this.inp_t) {
            clearTimeout(this.inp_t);
        } else {
            this._send(value);
            this.prev = value;
            this.send_t = setInterval(() => {
                if (this.prev !== this.cache) {
                    this.prev = this.cache;
                    this._send(this.cache);
                }
            }, Config.sliderTout);
        }

        this.inp_t = setTimeout(() => {
            clearInterval(this.send_t);
            this.inp_t = null;
        }, Config.sliderTout);
    }
    async _send(value) {
        this.widget.app.updateCache(this.id, value);
        let res = await this.widget.app.requset('set', this.id, value);
        if (res === null) this.widget.setError();
    }
}