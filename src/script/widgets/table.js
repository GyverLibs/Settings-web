import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import './table.css';
import parseTable from "../table";

export default class TableWidget extends WidgetBase {
    constructor(data) {
        super(data, false);
        if (data.label) this.labels = data.label.split(';');
        this.update(data.value);
        this.$root.style.padding = 0;
    }

    async update(value) {
        let table = [];

        if (typeof value === 'object') {
            table = parseTable(value);
        } else if (value.endsWith('.csv')) {
            let res = await this.data.app.fetchFile(value);
            if (!res) return;
            value = await res.text();
            table = value.trim().split('\n').map(x => x.split(';'));
        } else if (value.endsWith('.tbl')) {
            let res = await this.data.app.fetchFile(value);
            if (!res) return;
            table = parseTable(await res.arrayBuffer());
        } else {
            table = value.trim().split('\n').map(x => x.split(';'));
        }

        if (!table.length) return;

        EL.config(this.$root, {
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