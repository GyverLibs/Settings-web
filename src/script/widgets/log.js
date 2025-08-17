import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import { waitFrame } from "@alexgyver/utils";
import './log.css';

export default class LogWidget extends WidgetBase {
    constructor(data) {
        super(data, !!data.label);

        super.addChild(EL.make('div', {
            context: this,
            class: 'log',
            $: 'out',
            events: {
                scroll: () => {
                    if (!this.#lock) {
                        this.#auto = this.$out.scrollTop + this.$out.clientHeight == this.$out.scrollHeight;
                    }
                }
            }
        }));

        this.update(data.value);
    }

    async update(value) {
        let cls = (t) => {
            for (let v of ['info', 'warn', 'err']) {
                if (t.startsWith(v + ':')) return v;
            }
            return '';
        }
        if (!value) return;

        EL.config(this.$out, {
            children_r: value.split(/\r?\n/).map(t => EL.make(('p'), { text: t, class: cls(t) })),
        });
        if (this.#auto) {
            this.#lock = true;
            await waitFrame();
            this.$out.scrollTop = this.$out.scrollHeight;
            this.#lock = false;
        }
    }

    #auto = true;
    #lock = true;
}