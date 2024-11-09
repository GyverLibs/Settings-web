import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './slider.css';
import { AsyncPrompt } from "../ui/dialog";
import { Config } from '../config';
import Timer from "../timer";

export default class SliderWidget extends WidgetBase {
    timer;
    prev = null;

    constructor(data) {
        super(data);
        this.timer = new Timer();
        this.unit = data.unit ?? '';

        super.addOutput(Component.make('span', {
            context: this,
            var: 'out',
            class: 'value active',
            events: {
                click: async () => {
                    let res = await AsyncPrompt(data.label, this.$slider.value);
                    if (res) {
                        this.update(res);
                        this.send();
                    }
                }
            }
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
                    change: () => {
                        this.send();
                    },
                    input: () => {
                        this.move();
                        if (!this.timer.running()) {
                            this.timer.start(() => this.send(), Config.sliderTout);
                        }
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
        let digs = s.step.toString().split('.')[1];
        this.$out.innerText = Number(s.value).toFixed(digs ? digs.length : 0) + (this.unit ? this.unit : '');
    }

    send() {
        this.timer.stop();
        if (this.prev !== this.$slider.value) {
            this.prev = this.$slider.value;
            this.sendEvent(this.prev);
        }
    }
}