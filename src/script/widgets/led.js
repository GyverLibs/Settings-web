import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './led.css';
import { intToColor } from "../utils";

export default class LedWidget extends WidgetBase {
    constructor(data) {
        super(data);

        super.addOutput(Component.make('span', {
            context: this,
            class: 'led',
            var: 'led',
        }));

        this.update(data.value);
    }

    update(value) {
        if (this.data.color_on) {
            this.$led.style.setProperty('--color', intToColor(value == 1 ? this.data.color_on : this.data.color_off));
        } else {
            this.$led.classList = 'led' + (value == 1 ? ' on' : '');
        }
    }
}