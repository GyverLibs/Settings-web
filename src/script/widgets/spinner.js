import { EL, SVG } from "@alexgyver/component";
import NumberWidget from "./number";
import './spinner.css';
import { constrain, formatToStep } from "@alexgyver/utils";

export default class SpinnerWidget extends NumberWidget {
    constructor(data) {
        super(data);

        let cont = this.$out.parentNode;
        this.$out.remove();
        cont.appendChild(EL.make('div', {
            children: [
                // SVG.path('M12 5V19M5 12H19', { 'stroke-width': 2, 'stroke-linecap': "round", 'stroke-linejoin': "round", 'stroke': 'red' }),
                {
                    tag: 'span',
                    class: 'spin_btn',
                    text: '-',
                    events: {
                        click: () => this.change(-1),
                    }
                },
                {
                    tag: 'span',
                    class: 'value active',
                    style: 'margin: 0 5px',
                    $: 'out',
                },
                {
                    tag: 'span',
                    class: 'spin_btn',
                    text: '+',
                    events: {
                        click: () => this.change(1),
                    }
                },
            ]
        }));
        this.update(data.value);
    }

    update(value) {
        super.update(value);
        this.$out.innerText = formatToStep(this.$out.innerText, this.data.step);
    }

    change(dir) {
        let v = Number(this.text) + this.data.step * dir;
        if (this.data.min !== undefined && this.data.max !== undefined) {
            v = constrain(v, this.data.min, this.data.max);
        }
        if (this.text != v) {
            this.update(v);
            this.sendValue(v);
        }
    }
}