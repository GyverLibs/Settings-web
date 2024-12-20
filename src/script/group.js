import { Component } from "@alexgyver/component";
import MenuWidget from "./widgets/menu";
import { checkAndAppend } from "./utils";
import Row from "./row";

export default function Group(title, data, parent, pages, widgets) {
    if (!data.length) return document.createDocumentFragment();

    let ctx = {};
    let group = Component.make('div', {
        context: ctx,
        class: 'group',
        children: [
            !title ? null : {
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
            case 'row': ctx.$group_col.append(Row(obj.title, obj.content, parent, pages, widgets)); break;
            default:
                checkAndAppend(widgets, ctx.$group_col, obj);
                break;
        }
    }
    return group;
};