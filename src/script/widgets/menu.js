import { Component } from "@alexgyver/component";
import Page from "../page";
import WidgetBase from "./widget";
import { Arrow } from "../ui/misc";

export default function MenuWidget(title, data, parent, pages, sets) {
    if (!data.length) return document.createDocumentFragment();

    let page = Page(data, pages, sets);
    let widget = new WidgetBase({ label: title });
    widget.addOutput(Arrow('right', 20));

    Component.config(widget.$root, {
        style: 'cursor:pointer',
        events: {
            click: () => {
                page.dispatchEvent(new CustomEvent("menuclick", {
                    bubbles: true,
                    detail: {
                        page: page,
                        parent: parent,
                        label: title
                    }
                }));
            }
        }
    });
    return widget.$root;
};