import { Component } from "@alexgyver/component";
import WidgetEvent from "./event";

export default class WidgetBase {
    $root;
    $error;
    data;

    constructor(data, makeWidget = true) {
        this.data = data;
        if (makeWidget) Component.make('div', {
            context: this,
            class: 'widget',
            var: 'root',
            child: {
                tag: 'div',
                class: 'widget_row',
                var: 'row',
                children: [
                    {
                        tag: 'div',
                        // style: 'padding-right: 8px',
                        children: [
                            (data.label === null) ? null : {
                                class: 'widget_label',
                                tag: 'label',
                                text: data.label ?? data.type,
                            },
                            {
                                tag: 'sup',
                                class: 'error_sup',
                                text: 'Error!',
                                var: 'error',
                            }
                        ]
                    }
                ]
            }
        });
    }

    addOutput(out) {
        this.$row.append(out);
    }

    addChild(child) {
        this.$root.append(child);
    }

    sendEvent(value) {
        this.$root.dispatchEvent(new WidgetEvent('set', this.data.id, value, this));
    }

    setError() {
        this.$error.style.display = 'inline';
        setTimeout(() => {
            if (this.$error) this.$error.style.display = 'none';
        }, 2500);
    }

    update(value) { }
}