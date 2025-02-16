import { Component } from "@alexgyver/component";
import Page from "../page";
import WidgetBase from "./widget";
import { Arrow } from "../ui/misc";

export default function MenuWidget(title, data, cur, sets) {
    if (!data.length) return document.createDocumentFragment();

    let i = Page(cur, data, title, sets);
    let widget = new WidgetBase({ label: title });
    widget.addOutput(Arrow('right', 20));

    Component.config(widget.$root, {
        style: 'cursor:pointer',
        events: {
            click: () => sets.openPage({ index: i, parent: cur }),
        }
    });
    return widget.$root;
};