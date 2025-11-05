import { EL } from "@alexgyver/component";
import { Arrow } from "../ui/misc";
import WidgetBase from "../widgets/widget";
import Page from "./page";

export default function MenuWidget(title, data, cur, sets, parent) {
    if (!data.content.length) return;

    let i = Page(cur, data.content, title, sets, data.id);
    let widget = new WidgetBase({ label: title });
    parent.append(widget.$root);
    widget.addOutput(Arrow('right', 20));

    EL.config(widget.$root, {
        style: 'cursor:pointer',
        click: () => sets.openPage({ index: i, parent: cur }),
    });
};