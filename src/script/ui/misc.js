import { EL } from "@alexgyver/component";

export function Arrow(dir = 'right', size = 20, styles = {}) {
    return EL.make('div', {
        class: 'icon arrow ' + dir,
        style: {
            width: size + 'px',
            height: size + 'px',
            ...styles
        }
    });
}