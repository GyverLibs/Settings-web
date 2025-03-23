import { Component } from "@alexgyver/component";
import MenuWidget from "../widgets/menu";
import { checkAndAppend } from "./append";
import Buttons from "./buttons";

export default function Row(obj, cur, sets) {
    let title = obj.title
    let data = obj.content;
    if (!data.length) return document.createDocumentFragment();

    let ctx = {};
    let row = Component.make('div', {
        context: ctx,
        class: 'row',
        children: [
            !!title && {
                class: 'group_title',
                child: {
                    tag: 'span',
                    text: title,
                }
            },
            {
                class: ['group_row', (obj.divtype ?? 'default')],
                var: 'group_row',
            }
        ]
    });

    for (let obj of data) {
        if (!obj.label || !obj.label.length) obj.label = null;

        switch (obj.type) {
            case 'menu': ctx.$group_row.append(MenuWidget(obj.title, obj.content, cur, sets)); break;
            case 'buttons': ctx.$group_row.append(Buttons(obj, cur, sets)); break;
            case 'row': ctx.$group_row.append(Row(obj, cur, sets)); break;
            case 'group':
                break;
            default:
                checkAndAppend(sets, ctx.$group_row, obj);
                break;
        }
    }
    return row;
};