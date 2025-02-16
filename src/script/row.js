import { Component } from "@alexgyver/component";
import MenuWidget from "./widgets/menu";
import { checkAndAppend } from "./ui/misc";

export default function Row(obj, cur, sets) {
    let title = obj.title
    let data = obj.content;
    if (!data.length) return document.createDocumentFragment();

    // only buttons
    // let only_btns = true;
    // for (let obj of data) {
    //     if (obj.type != 'button') {
    //         only_btns = false;
    //         break;
    //     }
    // }
    // if (only_btns) {
    //     let btns = new ButtonsWidget(obj);
    //     return btns.$root;
    // }

    // any widgets
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
            case 'group': break;
            case 'row': break;
            default:
                checkAndAppend(sets, ctx.$group_row, obj);
                break;
        }
    }
    return row;
};