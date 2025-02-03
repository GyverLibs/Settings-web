import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import './tabs.css';
import { waitFrame } from "../utils";

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
                    tag: 'div',
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

        waitFrame().then(() => {
            this.$tabs.scrollLeft = this.$tabs.scrollWidth * data.value / this.options.length - this.$tabs.clientWidth / 2;
        });

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