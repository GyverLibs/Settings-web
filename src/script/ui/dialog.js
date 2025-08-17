import { EL } from "@alexgyver/component";
import './dialog.css';

export class DialogCont {
    constructor() {
        EL.make('div', {
            context: this,
            $: 'root',
            class: 'dialog_back',
            style: 'animation: fadeIn 0.16s;',
            parent: document.body,
        });
    }

    destroy() {
        this.$root.style.animation = 'fadeOut 0.16s';
        setTimeout(() => this.$root.remove(), 150);
    }
}

export function BaseDialog(label, content, actionOK, actionCancel, postRender = null) {
    let dialog = new DialogCont();

    EL.config(dialog.$root, {
        child: {
            class: 'dialog_cont',
            child: {
                class: 'dialog',
                children: [
                    {
                        tag: 'label',
                        text: label,
                    },
                    content,
                    {
                        class: 'dialog_btns',
                        children: [
                            {
                                class: 'button',
                                text: 'OK',
                                events: {
                                    click: async () => {
                                        let res = await actionOK();
                                        if (res || res == undefined) dialog.destroy();
                                    },
                                },
                            },
                            {
                                style: 'width: 20px',
                            },
                            {
                                class: 'button',
                                style: 'background: var(--error)',
                                text: 'Cancel',
                                events: {
                                    click: () => {
                                        actionCancel();
                                        dialog.destroy();
                                    },
                                },
                            }
                        ]
                    }
                ]
            }
        }
    });
    if (postRender) postRender();
}

export function AsyncPrompt(label, value, oninput = null, onconfirm = null) {
    return new Promise(resolve => {
        let area = EL.make('textarea', {
            text: value,
            rows: 1,
            events: {
                input: () => {
                    area.style.height = area.scrollHeight + "px";
                    if (oninput) area.value = oninput(area.value) + '';
                },
            }
        });

        BaseDialog(label, area,
            async () => {
                if (!onconfirm || await onconfirm(area.value)) {
                    resolve(area.value);
                    return true;
                }
                return false;
            },
            () => resolve(null),
            () => {
                area.focus();
                area.setSelectionRange(area.value.length, area.value.length);  // cursor end
                area.style.height = area.scrollHeight + "px";
            });
    });
}

export function AsyncConfirm(label) {
    return new Promise(resolve => {
        BaseDialog(label, null, () => resolve(1), () => resolve(0));
    });
}