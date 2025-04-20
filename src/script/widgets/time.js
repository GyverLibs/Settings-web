import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import './time.css';

class TimeWidgetBase extends WidgetBase {
    constructor(data, type) {
        super(data);

        this.gmt = (data.zone !== undefined ? -data.zone : new Date().getTimezoneOffset()) * 60;

        super.addOutput(EL.make('div', {
            context: this,
            class: 'input_cont',
            child: {
                class: 'date_block',
                children: [
                    {
                        tag: 'input',
                        var: 'input',
                        type: type,
                        class: 'date value',
                        step: 1,
                        events: {
                            change: () => {
                                if (!this.$input.value) this.update(0);
                                this.sendValue(this.getUnix());
                                this.update(this.getUnix());
                            },
                            click: () => this.$input.showPicker(),
                        }
                    },
                    {
                        tag: 'span',
                        class: 'value active',
                        var: 'out',
                    }
                ]
            }
        }));

        this.update(data.value);
    }

    update(value) {
        value = this.unixToValue(value ?? 0);
        this.$input.value = value;
        this.$out.innerText = value.replace('T', ' ');
    }

    getUnix() {
        return Math.floor(this.$input.valueAsNumber / 1000) + this.gmt;
    }

    getDateString(value) {
        return new Date((value - this.gmt) * 1000).toISOString();
    }

    unixToValue(value) { }
}

export class TimeWidget extends TimeWidgetBase {
    constructor(data) {
        super(data, 'time');
    }

    unixToValue(value) {
        return this.getDateString(value).split('T')[1].split('.')[0];
    }

    getUnix() {
        return Math.floor(this.$input.valueAsNumber / 1000);
    }

    getDateString(value) {
        return new Date(value * 1000).toISOString();
    }
}

export class DateWidget extends TimeWidgetBase {
    constructor(data) {
        super(data, 'date');
    }

    unixToValue(value) {
        return this.getDateString(value).split('T')[0];
    }
}

export class DateTimeWidget extends TimeWidgetBase {
    constructor(data) {
        super(data, 'datetime-local');
    }

    unixToValue(value) {
        return this.getDateString(value).split('.')[0];
    }
}