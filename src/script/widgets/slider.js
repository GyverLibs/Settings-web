import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './slider.css';

export default class SliderWidget extends WidgetBase {
    timeout = 60;  // between sends

    constructor(data) {
        super(data);
        this.unit = data.unit ?? '';

        super.addOutput(Component.make('span', {
            context: this,
            var: 'out',
            class: 'value',
        }));

        super.addChild(Component.make('div', {
            context: this,
            class: 'slider_cont',
            child: {
                tag: 'input',
                type: 'range',
                class: 'slider',
                var: 'slider',
                min: (data.min ?? 0) + '',
                max: (data.max ?? 100) + '',
                step: (data.step ?? 1) + '',
                events: {
                    input: () => {
                        this.move();
                        if (this._tmr) {
                            this._buf = this.$slider.value;
                        } else {
                            this.sendEvent(this.$slider.value);
                            this._buf = null;

                            this._tmr = setTimeout(() => {
                                if (this._buf) this.sendEvent(this._buf);
                                this._tmr = null;
                            }, this.timeout);
                        }
                    },
                }
            }
        }));

        this.update(data.value);
    }

    move() {
        let s = this.$slider;
        s.style.backgroundSize = (Number(s.value) - Number(s.min)) * 100 / (Number(s.max) - Number(s.min)) + '% 100%';
        let digs = s.step.toString().split('.')[1];
        this.$out.innerText = Number(s.value).toFixed(digs ? digs.length : 0) + (this.unit ? this.unit : '');
    }

    update(value) {
        this.$slider.value = Number(value ?? 0) + '';
        this.move();
    }

    _tmr = null;
    _buf = null;
}