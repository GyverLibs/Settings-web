import { EL } from "@alexgyver/component";
import { contrastColor, intToColor, isTouch } from "@alexgyver/utils";
import { lang } from "../lang";
import './button.css';

const contrast = 150;

export default class Button {
    constructor(data) {
        this.data = data;
        let col = ('color' in data) ? intToColor(data.color) : 'var(--accent)';
        EL.make('div', {
            context: this,
            $: 'root',
            class: 'button',
            style: {
                background: col,
                color: contrastColor(col, contrast),
            },
            child: {
                style: 'text-align: center',
                children: [
                    {
                        tag: 'span',
                        text: data.label ?? 'Button',
                        $: 'btext',
                    },
                    {
                        tag: 'sup',
                        class: 'error_sup',
                        text: lang.error,
                        $: 'error'
                    }
                ],
            },
        });

        if (data.button_hold) {
            if (isTouch()) {
                this.$root.ontouchstart = () => this._press(1);
                document.addEventListener("touchend", () => this._press(0));
            } else {
                this.$root.onmousedown = () => this._press(1);
                document.addEventListener("mouseup", () => this._press(0));
            }
        } else {
            this.$root.onclick = () => this._dispatch(1);
        }
    }

    update(value) {
        this.$btext.innerText = value;
    }

    updateColor(value) {
        let col = intToColor(value);
        this.$root.style.background = col;
        this.$root.style.color = contrastColor(col, contrast);
    }

    setError() {
        this.$error.style.display = 'inline';
        setTimeout(() => {
            if (this.$error) this.$error.style.display = 'none';
        }, 2500);
    }

    _press(val) {
        if (val) {
            this.#pressed = 1;
            this._dispatch(1);
        } else {
            if (this.#pressed) {
                this.#pressed = 0;
                this._dispatch(0);
            }
        }
    }

    async _dispatch(val) {
        let res = await this.data.app.requset('click', this.data.id, val);
        if (res === null) this.setError();
    }

    #pressed = 0;
}