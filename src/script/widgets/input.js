import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import { AsyncConfirm, AsyncPrompt } from "../ui/dialog";

export default class InputWidget extends WidgetBase {
    empty = false;
    text = "";

    constructor(data, oninput = null, onconfirm = null) {
        super(data);

        if (!oninput) oninput = (v) => data.maxlen ? v.slice(0, data.maxlen) : v;

        if (!onconfirm) onconfirm = async (val) => {
            if (data.regex && !new RegExp(data.regex, 'g').test(val)) {
                await AsyncConfirm(data.format ? data.format : ("Regex: " + data.regex));
                return false;
            }
            return true;
        }

        super.addOutput(Component.make('span', {
            context: this,
            class: 'value active',
            var: 'out',
            events: {
                click: async () => {
                    let res = await AsyncPrompt(data.label ?? data.type, this.text, oninput, onconfirm);
                    if (res !== null) {
                        this.sendEvent(encodeURIComponent(res));
                        this.update(res);
                    }
                }
            }
        }));

        this.update(data.value);
    }

    update(value) {
        this.text = (value ?? '') + '';
        let disp = '...';
        if (this.text.length) {
            let lines = this.text.split('\n');
            disp = lines[0];
            if (lines.length > 1) disp += '...';
        }
        this.$out.innerText = disp;
    }
}