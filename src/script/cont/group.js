import { Component } from "@alexgyver/component";
import { checkAndAppend } from "./append";
import MenuWidget from "../widgets/menu";
import Row from "./row";
import Buttons from "./buttons";

export default function Group(title, data, cur, sets) {
    if (!data.length) return document.createDocumentFragment();

    let ctx = {};
    let group = Component.make('div', {
        context: ctx,
        class: 'group',
        children: [
            !!title && {
                class: 'group_title',
                child: {
                    tag: 'span',
                    text: title,
                }
            },
            {
                class: 'group_col',
                var: 'group_col',
            }
        ]
    });

    for (let obj of data) {
        switch (obj.type) {
            case 'menu': ctx.$group_col.append(MenuWidget(obj.title, obj.content, cur, sets)); break;
            case 'row': ctx.$group_col.append(Row(obj, cur, sets)); break;
            case 'buttons': ctx.$group_col.append(Buttons(obj, cur, sets)); break;
            default:
                checkAndAppend(sets, ctx.$group_col, obj);
                break;
        }
    }
    return group;
};