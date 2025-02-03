import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './log.css';
import { waitFrame } from "../utils";

export default class LogWidget extends WidgetBase {
    constructor(data) {
        super(data, !!data.label);

        super.addChild(Component.make('p', {
            context: this,
            class: 'log',
            var: 'out',
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
        this.$out.innerText = value ?? '';
        await waitFrame();
        if (this.#auto) {
            this.#lock = true;
            this.$out.scrollTop = this.$out.scrollHeight;
            await waitFrame();
            this.#lock = false;
        }
    }

    #auto = true;
    #lock = true;
}