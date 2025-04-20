import { WidgetList } from "../widgets/widgets";

export function checkAndAppend(sets, parent, obj) {
    if (sets.widgets.has(obj.id)) {
        document.dispatchEvent(new CustomEvent("dup_id", { detail: { widget: obj } }));
    } else if (obj.type in WidgetList) {
        let w = new (WidgetList[obj.type])(obj);
        w.app = sets;
        parent.append(w.$root);
        sets.widgets.set(obj.id, w);
    }
}