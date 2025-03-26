import { EL } from "@alexgyver/component";
import WidgetEvent from "./wevent";
import './button.css';
import { contrastColor, intToColor, isTouch } from "@alexgyver/utils";

export default class Button {
    constructor(data) {
        this.id = data.id;
        let col = ('color' in data) ? intToColor(data.color) : 'var(--accent)';
        EL.make('div', {
            context: this,
            var: 'root',
            class: 'button',
            style: {
                background: col,
                color: contrastColor(col, 150),
            },
            child: {
                style: 'text-align: center',
                children: [
                    {
                        tag: 'span',
                        text: data.label ?? 'Button',
                        var: 'btext',
                    },
                    {
                        tag: 'sup',
                        class: 'error_sup',
                        text: 'Error!',
                        var: 'error'
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
        this.$root.style.color = contrastColor(col, 150);
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

    _dispatch(val) {
        document.dispatchEvent(new WidgetEvent('click', this.id, val, this));
    }

    #pressed = 0;
}