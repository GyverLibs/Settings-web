import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";

export default class HTMLWidget extends WidgetBase {
    constructor(data) {
        super(data, !!data.label);

        super.addChild(EL.make('div', {
            context: this,
            var: 'out',
            style: 'margin: 5px 0',
        }));

        this.update(data.value);
    }

    update(value) {
        this.$out.innerHTML = value ?? '';
    }
}