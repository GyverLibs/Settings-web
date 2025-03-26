import { EL } from "@alexgyver/component";
import { checkAndAppend } from "./append";

export default function Buttons(obj, cur, sets) {
    let root = EL.make('div', { class: 'buttons' });
    obj.content.filter(b => b.type == 'button').map(b => checkAndAppend(sets, root, b));
    return root;
};