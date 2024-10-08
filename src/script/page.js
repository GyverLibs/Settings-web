import { Component } from "@alexgyver/component";
import MenuWidget from "./widgets/menu";
import Group from "./group";
import { WidgetList } from "./widgets/widgets";

export default function Page(data, pages, widgets) {
    if (!data.length) return document.createDocumentFragment();
    
    let page = Component.make('div', { class: 'page', style: 'display: none' });
    pages.push(page);

    for (let obj of data) {
        switch (obj.type) {
            case 'menu': page.append(MenuWidget(obj.title, obj.content, page, pages, widgets)); break;
            case 'group': page.append(Group(obj.title, obj.content, page, pages, widgets)); break;
            default:
                if (widgets.has(obj.id)) {
                    document.dispatchEvent(new CustomEvent("dup_id", { detail: { widget: obj } }));
                    break;
                }
                if (obj.type in WidgetList) {
                    let w = new (WidgetList[obj.type])(obj);
                    page.append(w.$root);
                    widgets.set(obj.id, w);
                }
                break;
        }
    }
    return page;
};