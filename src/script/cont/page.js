import { EL } from "@alexgyver/component";
import { checkAndAppend } from "./append";
import MenuWidget from "../widgets/menu";
import Group from "./group";
import Row from "./row";
import Buttons from "./buttons";

export default function Page(parent, data, title, sets) {
    if (!data.length) return document.createDocumentFragment();

    let page = EL.make('div', { class: 'page', style: 'display: none' });
    let cur = sets.pages.length;
    sets.pages.push({ page: page, parent: parent, title:title });

    for (let obj of data) {
        switch (obj.type) {
            case 'menu': page.append(MenuWidget(obj.title, obj.content, cur, sets)); break;
            case 'group': page.append(Group(obj.title, obj.content, cur, sets)); break;
            case 'buttons': page.append(Buttons(obj, cur, sets)); break;
            case 'row': page.append(Row(obj, cur, sets)); break;
            default:
                checkAndAppend(sets, page, obj);
                break;
        }
    }
    return cur;
};