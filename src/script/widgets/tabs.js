import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './tabs.css';
import { waitRender } from "@alexgyver/utils";

export default class TabsWidget extends WidgetBase {
    constructor(data) {
        super(data, false);
        this.options = data.text.split(';');

        this.addChild(Component.make('div', {
            context: this,
            class: 'tabs',
            var: 'tabs',
            children: this.options.map((x, i) => {
                return {
                    class: 'tab',
                    text: x.trim(),
                    events: {
                        click: () => {
                            this.update(i);
                            this.sendEvent(i);
                        }
                    }
                }
            }),
            events: {
                mousedown: () => {
                    this.dragging = true;
                    this.$tabs.classList.add('dragging');
                },
            }
        }));
        document.addEventListener("mousemove", (e) => {
            if (this.dragging) this.$tabs.scrollLeft -= e.movementX;
        });
        document.addEventListener("mouseup", () => {
            this.dragging = false;
            this.$tabs.classList.remove('dragging');
        });

        waitRender(this.$tabs, tabs => {
            tabs.scrollLeft = tabs.scrollWidth * data.value / this.options.length - tabs.clientWidth / 2;
        })

        this.update(data.value);
    }

    update(value) {
        Array.from(this.$tabs.children).map((tab, i) => {
            if (value == i) tab.classList.add('active');
            else tab.classList.remove('active');
        });
    }

    dragging = false;
}