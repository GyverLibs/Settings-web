import { Component } from "@alexgyver/component";
import MenuWidget from "./widgets/menu";
import { WidgetList } from "./widgets/widgets";

export default function Group(title, data, parent, pages, widgets) {
    if (!data.length) return document.createDocumentFragment();

    let ctx = {};
    let group = Component.make('div', {
        context: ctx,
        class: 'group',
        children: [
            {
                tag: 'div',
                class: 'group_title',
                child: {
                    tag: 'span',
                    text: title ?? ''
                }
            },
            {
                tag: 'div',
                class: 'group_col',
                var: 'group_col',
            }
        ]
    });

    for (let obj of data) {
        switch (obj.type) {
            case 'menu': ctx.$group_col.append(MenuWidget(obj.title, obj.content, parent, pages, widgets)); break;
            default:
                if (widgets.has(obj.id)) {
                    document.dispatchEvent(new CustomEvent("dup_id", { detail: { widget: obj } }));
                    break;
                }
                if (obj.type in WidgetList) {
                    let w = new (WidgetList[obj.type])(obj);
                    ctx.$group_col.append(w.$root);
                    widgets.set(obj.id, w);
                }
                break;
        }
    }
    return group;
};