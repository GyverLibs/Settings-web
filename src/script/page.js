import { Component } from "@alexgyver/component";
import MenuWidget from "./widgets/menu";
import Group from "./group";
import { checkAndAppend } from "./utils";
import Row from "./row";

export default function Page(data, pages, sets) {
    if (!data.length) return document.createDocumentFragment();

    let page = Component.make('div', { class: 'page', style: 'display: none' });
    pages.push(page);

    for (let obj of data) {
        switch (obj.type) {
            case 'menu': page.append(MenuWidget(obj.title, obj.content, page, pages, sets)); break;
            case 'group': page.append(Group(obj.title, obj.content, page, pages, sets)); break;
            case 'row': page.append(Row(obj, page, pages, sets)); break;
            default:
                checkAndAppend(sets, page, obj);
                break;
        }
    }
    return page;
};