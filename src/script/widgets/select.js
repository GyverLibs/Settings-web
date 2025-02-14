import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import { DialogCont } from "../ui/dialog";
import './select.css';
import { Arrow } from "../ui/misc";

function SelectDialog(options, selected) {
    return new Promise(resolve => {
        let ctx = {};
        let dialog = new DialogCont();
        Component.config(dialog.$root, {
            style: 'cursor: pointer;',
            context: ctx,
            events: {
                click: () => {
                    dialog.destroy();
                    resolve(null);
                },
            },
            child: {
                class: 'dialog_cont',
                child: {
                    class: 'dialog select',
                    children: options.map((x, i) => Component.make('div',
                        {
                            text: x.trim(),
                            class: 'option' + (selected == i ? ' active' : ''),
                            events: {
                                click: e => {
                                    e.stopPropagation();
                                    dialog.destroy();
                                    resolve(i);
                                }
                            }
                        })),
                    also(el) {
                        setTimeout(() => {
                            el.scrollTop = selected / options.length * el.scrollHeight;
                        }, 1);
                    },
                },
            }

        });
    });
}

export default class SelectWidget extends WidgetBase {
    constructor(data) {
        super(data);
        this.options = data.text.split(';');

        super.addOutput(Component.make('div', {
            context: this,
            style: {
                display: 'flex',
                alignItems: 'center',
            },
            events: {
                click: async () => {
                    let res = await SelectDialog(this.options, this.value);
                    if (res !== null) {
                        this.update(res);
                        this.sendEvent(res);
                    }
                }
            },
            children: [
                {
                    tag: 'span',
                    class: 'value active',
                    style: 'padding-right: 7px',
                    var: 'label',
                },
                Arrow('down', 15)
            ]
        }));

        this.update(data.value);
    }

    update(value) {
        this.value = (value ?? 0) + '';
        this.$label.textContent = this.options[this.value];
    }
}