import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './switch.css';
import { intToColor } from "../utils";

export default class SwitchWidget extends WidgetBase {
    constructor(data) {
        super(data);

        super.addOutput(Component.make('div', {
            context: this,
            class: 'switch_cont',
            child: {
                tag: 'input',
                class: 'switch',
                type: 'checkbox',
                var: 'switch',
                style: data.color ? `--accent: ${intToColor(data.color)}` : '',
                events: {
                    click: () => this.sendEvent(this.$switch.checked ? 1 : 0),
                }
            }
        }));

        this.update(data.value);
    }

    update(value) {
        this.$switch.checked = Number(value ?? 0);
    }
}