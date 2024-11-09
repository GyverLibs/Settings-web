export default class Timer {
    #tmr = null;
    #cb = null;
    #prd = 0;

    constructor(cb = null, prd = null) {
        this.#cb = cb;
        this.#prd = prd;
    }

    start(cb = null, prd = null) {
        if (cb) this.#cb = cb;
        if (prd) this.#prd = prd;

        this.stop();

        if (this.#prd && this.#cb) {
            this.#tmr = setTimeout(() => {
                this.stop();
                this.#cb();
            }, this.#prd);
        }
    }

    stop() {
        if (this.#tmr) {
            clearTimeout(this.#tmr);
            this.#tmr = null;
        }
    }

    running() {
        return this.#tmr;
    }
}