import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import './paragraph.css';

export default class ParagraphWidget extends WidgetBase {
    constructor(data) {
        super(data, !!data.label);

        super.addChild(EL.makeIn(this, 'p', {
            $: 'out',
            class: 'paragraph',
        }));

        this.update(data.value);
    }

    update(value) {
        this.$out.innerText = value ?? '';
    }
}