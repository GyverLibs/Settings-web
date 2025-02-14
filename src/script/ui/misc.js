import { Component } from "@alexgyver/component";
import { WidgetList } from "../widgets/widgets";

export function checkAndAppend(sets, parent, obj) {
    if (sets.widgets.has(obj.id)) {
        document.dispatchEvent(new CustomEvent("dup_id", { detail: { widget: obj } }));
    } else if (obj.type in WidgetList) {
        obj.sets = sets;
        let w = new (WidgetList[obj.type])(obj);
        parent.append(w.$root);
        sets.widgets.set(obj.id, w);
    }
}

export function Arrow(dir = 'right', size = 20, styles = {}) {
    return Component.make('div', {
        class: 'icon arrow ' + dir,
        style: {
            width: size + 'px',
            height: size + 'px',
            ...styles
        }
    });
}