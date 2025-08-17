import { EL, SVG } from "@alexgyver/component";
import WidgetBase from "./widget";
import DragBlock from "@alexgyver/drag-block";
import { constrain, map, waitFrame, waitRender } from "@alexgyver/utils";
import './joystick.css';

export default class JoyWidget extends WidgetBase {
    constructor(data) {
        super(data, false);

        this.addChild(EL.make('svg', {
            style: 'width:100%;aspect-ratio:1/1;max-width:300px',
            $: 'svg',
            children: [
                SVG.circle(0, 0, 0, { class: 'ring' }, { $: 'ring' }),
                SVG.circle(0, 0, 0, { fill: 'var(--accent)', filter: 'drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2))' }, { class: 'joy', $: 'joy' }),
            ],
        }));

        this.$root.style = 'flex-shrink:1;display:flex;justify-content:center;';

        waitRender(this.$svg).then(() => {
            const attr = v => Number(this.$joy.getAttribute(v));

            this._render();
            this._resizer = new ResizeObserver(() => waitFrame().then(() => this._render()));
            this._resizer.observe(this.$svg);

            DragBlock(this.$joy, e => {
                let s = this.$svg.clientWidth;
                if (e.touch && e.type == 'move') e.type = 'drag';

                switch (e.type) {
                    case 'press':
                    case 'tpress':
                        this.$ring.classList.add('active');
                        break;

                    case 'drag':
                        let r = attr('r');
                        let offs = r + 6;
                        let x = constrain(attr('cx') + e.move.x, offs, s - offs);
                        let y = constrain(attr('cy') + e.move.y, offs, s - offs);
                        // let x = constrain(e.pos.x, offs, s - offs);
                        // let y = constrain(e.pos.y, offs, s - offs);

                        SVG.config(this.$joy, { attrs: { cx: x, cy: y } });

                        let sx = map(x, offs, s - offs, -255, 255) | 0;
                        let sy = map(y, offs, s - offs, 255, -255) | 0;
                        let a = new Uint16Array([sx, sy]);
                        this.sendValue(a[0] << 16 | a[1]);
                        break;

                    case 'release':
                    case 'trelease':
                        this.$ring.classList.remove('active');
                        if (this.data.center) {
                            this._render();
                            this.sendValue(0);
                        }
                        break;
                }
            });
        });
    }

    _render() {
        let s = this.$svg.clientWidth;
        if (!s) return;
        SVG.config(this.$joy, { attrs: { cx: s / 2, cy: s / 2, r: s / 4 } });
        SVG.config(this.$ring, { attrs: { cx: s / 2, cy: s / 2, r: s / 2 - 5 } });
    }
}