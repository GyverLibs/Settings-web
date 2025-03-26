import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import SVPlot from "@alexgyver/svplot";
import parseTable from "../table";
import { waitRender } from "@alexgyver/utils";
import './plot.css';

class PlotBase extends WidgetBase {
    constructor(data, type) {
        super(data, false);

        super.addChild(EL.make('div', {
            context: this,
            var: 'out',
            class: 'plot',
        }));

        this.$root.style.padding = '0px 2px 3px';

        waitRender(this.$out).then(() => {
            this.plot = new SVPlot(this.$out,
                {
                    type: type,
                    dark: document.body.classList.contains('theme_dark'),
                    labels: data.label ? data.label.split(';') : [],
                    period: data.period,
                });
            this.update(data.value);
            this.$out.addEventListener('dark_change', e => this.plot.setConfig({ dark: e.detail.dark }));
        });
    }

    async getTable(value) {
        if (typeof value === 'string') {
            let res = await this.data.sets.fetchFile(value);
            if (!res) return;
            if (value.endsWith('.csv')) {
                value = await res.text();
                return value.trim().split(/\r?\n/).map(row => row.split(/;|,/).map(Number));
            } else {
                value = await res.arrayBuffer();
            }
        }
        return parseTable(value);
    }
}

export class PlotRunWidget extends PlotBase {
    constructor(data) {
        super(data, 'running');
    }

    update(value) {
        if (!value || !this.plot) return;
        let f = new Float32Array(value.buffer);
        this.plot.setData([...f]);
    }
}

export class PlotStockWidget extends PlotBase {
    constructor(data) {
        super(data, 'stack');
    }

    update(value) {
        if (!value || !this.plot) return;
        let f = new Float32Array(value.buffer);
        this.plot.setData([...f]);
    }
}

export class PlotWidget extends PlotBase {
    constructor(data) {
        super(data, 'plot');
    }

    async update(value) {
        if (!value || this.data.sets.fromCache || !this.plot) return;
        let table = await this.getTable(value);
        if (!table) return;

        let data = {};
        table.map(row => data[row[0]] = row.slice(1, row.length));
        this.plot.setData(data);
    }
}

export class PlotTimeWidget extends PlotBase {
    constructor(data) {
        super(data, 'timeline');
    }

    async update(value) {
        if (!value || this.data.sets.fromCache || !this.plot) return;
        let table = await this.getTable(value);
        if (!table) return;

        let data = {};
        switch (this.data.tmode) {
            case 0: // Single
                if (table[0].length == 3) table.map(row => data[row[0]] = { [row[1]]: row[2] });
                break;

            case 1: // All
                table.map(row => data[row[0]] = row.slice(1, row.length));
                break;

            case 2: // Mask
                if (table[0].length == 2) {
                    let ax = this.data.label.split(';');
                    table.map(row => {
                        let arr = [];
                        ax.map((v, i) => arr.push((row[1] >> i) & 1));
                        data[row[0]] = arr;
                    });
                }
                break;
        }
        this.plot.setData(data);
    }
}