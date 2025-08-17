import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import { AsyncPrompt } from "../ui/dialog";
import { findFloat, formatToStep, intToColor } from "@alexgyver/utils";
import './slider.css';

export default class SliderWidget extends WidgetBase {
    constructor(data) {
        super(data);
        this.unit = data.unit ?? '';

        super.addOutput(EL.make('span', {
            context: this,
            $: 'out',
            class: 'value active',
            events: {
                click: async () => {
                    let res = await AsyncPrompt(data.label ?? data.type, this.$slider.value, (v) => findFloat(v));
                    if (res) {
                        this.update(res);
                        this.send();
                    }
                }
            }
        }));

        super.addChild(EL.make('div', {
            context: this,
            class: 'slider_cont',
            child: {
                tag: 'input',
                type: 'range',
                class: 'slider',
                $: 'slider',
                style: ('color' in data) ? `--accent: ${intToColor(data.color)}` : '',
                min: (data.min ?? 0) + '',
                max: (data.max ?? 100) + '',
                step: (data.step ?? 1) + '',
                events: {
                    change: () => {
                        this.send();
                    },
                    input: () => {
                        this.move();
                        this.send();
                    },
                }
            }
        }));

        this.update(data.value);
    }

    update(value) {
        this.$slider.value = Number(value ?? 0) + '';
        this.move();
    }

    move() {
        let s = this.$slider;
        s.style.backgroundSize = (Number(s.value) - Number(s.min)) * 100 / (Number(s.max) - Number(s.min)) + '% 100%';
        this.$out.innerText = formatToStep(s.value, s.step) + (this.unit ? this.unit : '');
    }

    send() {
        this.sendValue(this.$slider.value);
    }
}