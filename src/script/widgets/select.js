import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";
import { DialogCont } from "../ui/dialog";
import './select.css';
import { Arrow } from "../ui/misc";
import { last, waitFrame } from "@alexgyver/utils";

function SelectDialog(groups, selected) {
    return new Promise(resolve => {
        let dialog = new DialogCont();
        let i = 0;

        let options = groups.map(g => {
            return {
                class: g.title.startsWith('~') && 'hidden',
                children: [
                    {
                        text: g.title,
                        class: ['title', !g.title && 'hidden'],
                    },
                    ...g.opts.map(opt => {
                        let cur = i++;
                        return {
                            text: opt.trim(),
                            class: ['option', (selected == cur && 'active'), opt.startsWith('~') && 'hidden'],
                            events: {
                                click: e => {
                                    e.stopPropagation();
                                    dialog.destroy();
                                    resolve(cur);
                                }
                            }
                        }
                    })]
            }
        });

        Component.config(dialog.$root, {
            style: 'cursor: pointer;',
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
                    children: options,
                    also(el) {
                        let len = 0;
                        groups.map(g => len += g.length);
                        waitFrame().then(() => el.scrollTop = selected / len * el.scrollHeight);
                    },
                },
            }
        });
    });
}

export default class SelectWidget extends WidgetBase {
    constructor(data) {
        super(data);
        let groups = [];

        if (data.text.startsWith('[')) {
            this.options = [];
            let res = data.text.matchAll(/\[(.+?)\]([^\[]+)/g);
            if (res) {
                for (let g of res) {
                    let opts = g[2].trim().split(/;|\n/);
                    if (!last(opts)) opts.pop();
                    groups.push({ title: g[1], opts: opts });
                    this.options.push(...opts);
                }
            }
        } else {
            this.options = data.text.trim().split(/;|\n/);
            if (!last(this.options)) this.options.pop();
            groups.push({ title: '', opts: this.options });
        }

        super.addOutput(Component.make('div', {
            context: this,
            style: {
                display: 'flex',
                alignItems: 'center',
            },
            events: {
                click: async () => {
                    let res = await SelectDialog(groups, this.value);
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
        this.value = value ?? 0;
        this.$label.textContent = this.options[this.value];
    }
}