import { Component } from "@alexgyver/component"

export default function renderInfoRow(ctx, label, varname) {
    return Component.make('div', {
        context: ctx,
        class: 'widget',
        child: {
            class: 'widget_row',
            children: [
                {
                    tag: 'label',
                    class: 'widget_label',
                    text: label,
                },
                {
                    class: 'value bold',
                    var: varname,
                }
            ]
        }
    });
}