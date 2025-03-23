import { Component } from "@alexgyver/component";

export function Arrow(dir = 'right', size = 20, styles = {}) {
    return Component.make('div', {
        class: 'icon arrow ' + dir,
        style: {
            width: size + 'px',
            height: size + 'px',
            ...styles
        }
    });
}