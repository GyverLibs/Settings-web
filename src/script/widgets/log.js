import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './log.css';

export default class LogWidget extends WidgetBase {
    constructor(data) {
        super(data, !!data.label);

        super.addChild(Component.make('p', {
            context: this,
            class: 'log',
            var: 'out',
        }));

        this.update(data.value);
    }

    update(value) {
        this.$out.innerText = value ?? '';
    }
}