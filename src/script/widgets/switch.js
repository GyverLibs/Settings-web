import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import './switch.css';
import { intToColor } from "@alexgyver/utils";

export default class SwitchWidget extends WidgetBase {
    constructor(data) {
        super(data);

        super.addOutput(EL.make('div', {
            context: this,
            child: {
                tag: 'input',
                class: 'switch',
                type: 'checkbox',
                var: 'switch',
                style: ('color' in data) ? `--accent: ${intToColor(data.color)}` : '',
                events: {
                    click: () => this.sendValue(this.$switch.checked ? 1 : 0),
                }
            }
        }));

        this.update(data.value);
    }

    update(value) {
        this.$switch.checked = Number(value ?? 0);
    }
    updateColor(value) {
        this.$switch.style.setProperty('--accent', intToColor(value));
    }
}