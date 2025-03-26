import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import { intToColor } from "@alexgyver/utils";
import './color.css';

export default class ColorWidget extends WidgetBase {
    constructor(data) {
        super(data);

        super.addOutput(EL.make('div', {
            context: this,
            class: 'input_cont',
            child: {
                class: 'color_block',
                children: [
                    {
                        class: 'color_out',
                        var: 'out',
                    },
                    {
                        tag: 'input',
                        type: 'color',
                        class: 'color',
                        var: 'col',
                        attrs: { 'colorpick-eyedropper-active': false },
                        events: {
                            change: () => {
                                this.updateOut();
                                this.sendEvent(this.hexCol());
                            }
                        }
                    },
                ]
            }
        }));

        this.update(data.value);
    }

    hexCol() {
        let hex = this.$col.value.slice(1);
        if (hex.length == 3) hex = hex.split('').map(x => x + x).join('');
        return parseInt(hex, 16);
    }

    update(value) {
        this.$col.value = intToColor(value ?? 0);
        this.updateOut();
    }

    updateOut() {
        this.$out.textContent = this.$col.value;
        this.$out.style.background = this.$col.value;
        let mid = 0;
        this.$col.value.slice(1).match(/.{2}/g).forEach(x => mid += parseInt(x, 16) / 3);
        this.$out.style.color = mid < 128 ? 'white' : 'black';
    }
}