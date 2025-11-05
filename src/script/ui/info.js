import { EL } from "@alexgyver/component"

export default function renderInfoRow(ctx, label, varname) {
    return EL.makeIn(ctx, 'div', {
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
                    $: varname,
                }
            ]
        }
    });
}