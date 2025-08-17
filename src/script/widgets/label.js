import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import { intToColor } from "@alexgyver/utils";

export default class LabelWidget extends WidgetBase {
    constructor(data) {
        super(data);

        super.addOutput(EL.make('span', {
            context: this,
            $: 'out',
            class: 'value bold',
            style: {
                color: ('color' in data) ? intToColor(data.color) : 'var(--font_tint)',
            }
        }));

        this.update(data.value);
    }

    update(value) {
        if (this.data.step) this.$out.innerText = (value ?? 0).toFixed(this.data.step) + '';
        else this.$out.innerText = (value ?? '') + '';
    }

    updateColor(value) {
        this.$out.style.color = intToColor(value);
    }
}