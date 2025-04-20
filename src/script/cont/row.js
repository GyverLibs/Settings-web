import { EL } from "@alexgyver/component";
import { checkAndAppend } from "./append";
import Buttons from "./buttons";
import MenuWidget from "./menu";

export default function Row(obj, cur, sets, parent) {
    let data = obj.content;
    if (!data.length) return;

    let r = [];
    let row = EL.make('div', {
        class: 'row',
        children: [
            !!obj.title && {
                class: 'group_title',
                child: {
                    tag: 'span',
                    text: obj.title,
                }
            },
            {
                class: ['group_row', (obj.divtype ?? 'default')],
                push: r,
            }
        ]
    });
    parent.append(row);

    for (let obj of data) {
        if (!obj.label || !obj.label.length) obj.label = null;

        switch (obj.type) {
            case 'menu': MenuWidget(obj.title, obj, cur, sets, r[0]); break;
            case 'buttons': Buttons(obj, cur, sets, r[0]); break;
            case 'row': Row(obj, cur, sets, r[0]); break;
            case 'group': break;
            default: checkAndAppend(sets, r[0], obj); break;
        }
    }
};