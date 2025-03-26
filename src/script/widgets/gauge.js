import { intToColor, map } from "@alexgyver/utils";
import LabelWidget from "./label";
import './gauge.css';

export default class GaugeWidget extends LabelWidget {
    constructor(data) {
        super(data);

        this.$root.classList.add('gauge');
        this.updateColor(data.color);
    }

    update(value) {
        value = value ?? 0;
        super.update(value);
        this.$out.innerText += this.data.unit;
        this.$root.style.setProperty('--value', map(value, this.data.min, this.data.max, 0, 100) + '%');
    }

    updateColor(color) {
        this.$root.style.setProperty('--color', color ? intToColor(color) : 'var(--accent)');
    }
}