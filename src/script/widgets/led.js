import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import { deltaColor, intToColor, midColor } from "@alexgyver/utils";
import './led.css';

export default class LedWidget extends WidgetBase {
    constructor(data) {
        super(data);

        super.addOutput(EL.make('div', {
            context: this,
            class: 'led_cont',
            child: {
                tag: 'span',
                class: 'led',
                $: 'led',
            }
        }));

        if ('color_on' in data) {
            this.col_on = intToColor(this.data.color_on);
            this.col_off = intToColor(this.data.color_off);
        } else {
            this.col_on = '#37A93C';
            this.col_off = '#d31616';
        }

        this.update(data.value);
    }

    update(value) {
        this._updColor((value == 1) ? this.col_on : this.col_off);
    }
    updateColor(value) {
        this._updColor(intToColor(value));
    }

    _updColor(col) {
        this.$led.style.setProperty('--color', col);
        this.$led.style.boxShadow = 'inset 2px 3px 0px 0px #fff3' + ((midColor(col) <= 80 || deltaColor(col) < 50) ? '' : ',var(--color) 0 0 7px 0px');
    }
}