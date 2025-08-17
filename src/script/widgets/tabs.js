import { EL } from "@alexgyver/component";
import WidgetBase from "./widget";
import './tabs.css';
import { waitRender } from "@alexgyver/utils";

export default class TabsWidget extends WidgetBase {
    constructor(data) {
        super(data, false);
        let t = data.text.trim();
        if (t.endsWith(';')) t = t.slice(0, -1);
        this.options = t.split(/;|\n/);

        this.addChild(EL.make('div', {
            context: this,
            class: 'tabs',
            $: 'tabs',
            children: this.options.map((x, i) => {
                return {
                    class: 'tab',
                    text: x.trim(),
                    events: {
                        click: () => {
                            this.update(i);
                            this.sendValue(i);
                        }
                    }
                }
            })
        }));

        this.$tabs.addEventListener("mousedown", (e) => {
            this._drag = true;
            this.$tabs.classList.add('dragging');
        });
        document.addEventListener("mousemove", (e) => {
            if (this._drag) this.$tabs.scrollLeft -= e.movementX;
        });
        document.addEventListener("mouseup", () => {
            this._drag = false;
            this.$tabs.classList.remove('dragging');
        });

        this.update(data.value);

        waitRender(this.$tabs, () => {
            this.$tabs.scrollLeft = this.$tabs.scrollWidth * this.data.value / this.options.length - this.$tabs.clientWidth / 2;
        });
    }

    update(value) {
        Array.from(this.$tabs.children).map((tab, i) => {
            if (value == i) tab.classList.add('active');
            else tab.classList.remove('active');
        });
    }

    _drag = false;
}