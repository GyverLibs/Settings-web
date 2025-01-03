import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import { AsyncPrompt } from "../ui/dialog";

export default class InputWidget extends WidgetBase {
    empty = false;
    text = "";

    constructor(data, oninput = null) {
        super(data);

        super.addOutput(Component.make('span', {
            context: this,
            class: 'value active',
            var: 'out',
            events: {
                click: async () => {
                    let res = await AsyncPrompt(data.label ?? data.type, this.text, oninput);
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