import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import { AsyncPrompt } from "../ui/dialog";
import { Config } from '../config';
import Timer from "../timer";
import { intToColor, parseFloatNoNaN } from "../utils";
import './slider2.css';
import WidgetEvent from "./event";

export default class Slider2Widget extends WidgetBase {
    timer;
    prev1 = null;
    prev2 = null;

    constructor(data) {
        super(data);
        this.timer = new Timer();
        this.unit = data.unit ?? '';
        this.color = data.color ? intToColor(data.color) : 'var(--accent)';

        super.addOutput(Component.make('div', {
            context: this,
            children: [
                {
                    tag: 'span',
                    var: 'out1',
                    class: 'value active',
                    events: {
                        click: async () => {
                            let res = await AsyncPrompt(data.label ?? data.type, this.$slider1.value, (area) => area.value = parseFloatNoNaN(area.value) + '');
                            if (res) {
                                this.update([res, this.$slider2.value]);
                                this.send();
                            }
                        }
                    }
                },
                {
                    tag: 'span',
                    text: '..',
                    style: 'padding-right: 5px;color: var(--font_tint);',
                },
                {
                    tag: 'span',
                    var: 'out2',
                    class: 'value active',
                    events: {
                        click: async () => {
                            let res = await AsyncPrompt(data.label ?? data.type, this.$slider2.value, (area) => area.value = parseFloatNoNaN(area.value) + '');
                            if (res) {
                                this.update([this.$slider1.value, res]);
                                this.send();
                            }
                        }
                    }
                }
            ]
        }));

        let slider = {
            tag: 'input',
            type: 'range',
            class: 'slider2',
            min: (data.min ?? 0) + '',
            max: (data.max ?? 100) + '',
            step: (data.step ?? 1) + '',
        }

        super.addChild(Component.make('div', {
            context: this,
            class: 'slider2_cont',
            children: [
                {
                    tag: 'div',
                    class: 'track',
                    var: 'track',
                },
                {
                    var: 'slider1',
                    ...slider,
                    events: {
                        input: () => {
                            this.check1();
                            this.move();
                            if (!this.timer.running()) {
                                this.timer.start(() => this.send(), Config.sliderTout);
                            }
                        },
                    }
                },
                {
                    var: 'slider2',
                    ...slider,
                    events: {
                        input: () => {
                            this.check2();
                            this.move();
                            if (!this.timer.running()) {
                                this.timer.start(() => this.send(), Config.sliderTout);
                            }
                        },
                    }
                }
            ]
        }));

        this.update(data.value);
    }

    check1() {
        let s1 = this.$slider1, s2 = this.$slider2;
        if (Number(s1.value) > Number(s2.value) - Number(s1.step)) s1.value = Number(s2.value) - Number(s1.step);
    }
    check2() {
        let s1 = this.$slider1, s2 = this.$slider2;
        if (Number(s2.value) < Number(s1.value) + Number(s1.step)) s2.value = Number(s1.value) + Number(s1.step);
    }

    update(value) {
        this.$slider1.value = Number(value[0] ?? 0) + '';
        this.$slider2.value = Number(value[1] ?? 0) + '';
        this.check1();
        this.move();
    }

    move() {
        let s1 = this.$slider1, s2 = this.$slider2;
        let map = (x) => (Number(x) - Number(s1.min)) * 100 / (Number(s1.max) - Number(s1.min));
        let p1 = map(s1.value);
        let p2 = map(s2.value);
        this.$track.style.background = `linear-gradient(to right, var(--dark) ${p1}% , ${this.color} ${p1}% , ${this.color} ${p2}%, var(--dark) ${p2}%)`;
        let digs = s1.step.toString().split('.')[1];

        let makeOut = (s) => {
            return Number(s.value).toFixed(digs ? digs.length : 0);
        }
        this.$out1.innerText = makeOut(s1);
        this.$out2.innerText = makeOut(s2) + (this.unit ? this.unit : '');
    }

    send() {
        this.timer.stop();
        if (this.prev1 !== this.$slider1.value) {
            this.prev1 = this.$slider1.value;
            this.$root.dispatchEvent(new WidgetEvent('set', this.data.id, this.prev1, this));
        }
        if (this.prev2 !== this.$slider2.value) {
            this.prev2 = this.$slider2.value;
            this.$root.dispatchEvent(new WidgetEvent('set', this.data.id2, this.prev2, this));
        }
    }
}