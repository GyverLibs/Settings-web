import { EL } from "@alexgyver/component";
import { checkAndAppend } from "./append";
import Row from "./row";
import Buttons from "./buttons";
import MenuWidget from "./menu";

export default function Group(title, data, cur, sets, parent) {
    if (!data.length) return;

    let g = [];
    let group = EL.make('div', {
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
                push: g,
            }
        ]
    });
    parent.append(group);

    for (let obj of data) {
        switch (obj.type) {
            case 'menu': MenuWidget(obj.title, obj, cur, sets, g[0]); break;
            case 'row': Row(obj, cur, sets, g[0]); break;
            case 'buttons': Buttons(obj, cur, sets, g[0]); break;
            default: checkAndAppend(sets, g[0], obj); break;
        }
    }
};