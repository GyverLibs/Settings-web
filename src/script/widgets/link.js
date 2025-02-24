import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import { Arrow } from "../ui/misc";

export default class LinkWidget extends WidgetBase {
    constructor(data) {
        super(data);

        this.addOutput(Arrow('right', 20));

        Component.config(this.$root, {
            style: 'cursor:pointer',
            events: {
                click: () => {
                    try {
                        window.open(data.value, "_blank");
                    } catch (e) { }
                },
            }
        });
    }
}