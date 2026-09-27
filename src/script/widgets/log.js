import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import { waitFrame } from "@alexgyver/utils";
import './log.css';

export default class LogWidget extends WidgetBase {
    constructor(data) {
        super(data, !!data.label);

        super.addChild(EL.makeIn(this, 'div', {
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
        if (!value) return;

        let textAndClass = (t) => {
            for (let v of ['info', 'warn', 'err']) {
                if (t.startsWith(v + ':')) return { text: t.slice(v.length + 1).trim(), class: v };
            }
            return { text: t };
        }

        EL.config(this.$out, {
            children_r: value.split(/\r?\n/).map(t => EL.make('p', textAndClass(t))),
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