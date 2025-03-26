import { EL } from "@alexgyver/component";
import { lang } from "../lang";
import DelaySend from "../DelaySend";

export default class WidgetBase {
    $root;
    $error;
    data;

    constructor(data, makeRow = true, makeWidget = true) {
        this.data = data;
        if (makeWidget) {
            EL.make('div', {
                context: this,
                class: 'widget',
                var: 'root',
                child: makeRow && {
                    class: 'widget_row',
                    var: 'row',
                    children: [
                        {
                            // style: 'padding-right: 8px',
                            children: [
                                (data.label !== null) && {
                                    class: 'widget_label',
                                    tag: 'label',
                                    text: data.label ?? data.type,
                                },
                                {
                                    tag: 'sup',
                                    class: 'error_sup',
                                    text: lang.error,
                                    var: 'error',
                                }
                            ]
                        }
                    ]
                }
            });
        } else {
            this.$root = document.createDocumentFragment();
        }
        this.sender = new DelaySend(this.data.id, this);
    }

    addOutput(out) {
        this.$row.append(out);
    }

    addChild(child) {
        this.$root.append(child);
    }

    sendEvent(value) {
        this.sender.send(value);
    }

    setError() {
        if (!this.$error) return;
        this.$error.style.display = 'inline';
        setTimeout(() => {
            if (this.$error) this.$error.style.display = 'none';
        }, 2500);
    }

    update(value) { }
    updateColor(value) { }
}