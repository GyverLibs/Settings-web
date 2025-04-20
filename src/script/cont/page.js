import { EL } from "@alexgyver/component";
import { checkAndAppend } from "./append";
import Group from "./group";
import Row from "./row";
import Buttons from "./buttons";
import MenuWidget from "./menu";

export default function Page(p, data, title, sets) {
    let page = EL.make('div', { class: 'page', style: 'display: none' });
    let cur = sets.pages.length;
    sets.pages.push({ page: page, parent: p, title: title });
    sets.$main_col.append(page);

    for (let obj of data) {
        switch (obj.type) {
            case 'menu': MenuWidget(obj.title, obj, cur, sets, page); break;
            case 'group': Group(obj.title, obj.content, cur, sets, page); break;
            case 'buttons': Buttons(obj, cur, sets, page); break;
            case 'row': Row(obj, cur, sets, page); break;
            default: checkAndAppend(sets, page, obj); break;
        }
    }
    return cur;
};