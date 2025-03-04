import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './table.css';

export default class TableWidget extends WidgetBase {
    constructor(data) {
        super(data, false);
        if (data.label) this.labels = data.label.split(';');
        this.update(data.value);
        this.$root.style.padding = 0;
    }

    async update(value) {
        if (value.endsWith('.csv')) {
            let res = await this.data.sets.fetchFile(value);
            if (!res) return;
            value = await res.text();
            // return;
        }

        let table = value.trim().split('\n').map(x => x.split(';'));

        Component.config(this.$root, {
            child_r: {
                class: 'table',
                child: {
                    tag: 'table',
                    children: [
                        this.labels && {
                            tag: 'tr',
                            children: this.labels.map(x => x = { tag: 'th', text: x }),
                        },
                        ...table.map(row => {
                            return {
                                tag: 'tr',
                                children: row.map(td => td = { tag: 'td', text: td }),
                            }
                        }),
                    ]
                }
            }
        });
    }

    labels = null;
}