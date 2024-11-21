import { Component } from "@alexgyver/component";
import { checkAndAppend } from "./utils";
import MenuWidget from "./widgets/menu";

export default function Row(title, data, parent, pages, widgets) {
    if (!data.length) return document.createDocumentFragment();

    let ctx = {};
    let row = Component.make('div', {
        context: ctx,
        class: 'row',
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
                class: 'group_row',
                var: 'group_row',
            }
        ]
    });

    for (let obj of data) {
        if (!obj.label || !obj.label.length) obj.label = null;
        switch (obj.type) {
            case 'menu': ctx.$group_row.append(MenuWidget(obj.title, obj.content, parent, pages, widgets)); break;
            case 'group': break;
            case 'row': break;
            default:
                checkAndAppend(widgets, ctx.$group_row, obj);
                break;
        }
    }
    return row;
};