import { Component } from "@alexgyver/component";
import WidgetBase from "./widget";

export default class ImageWidget extends WidgetBase {
    constructor(data) {
        super(data, !!data.label);

        super.addChild(Component.make('img', {
            context: this,
            var: 'out',
            class: 'image',
            style: 'width: 100%;border-radius: 5px',
        }));

        this.update(data.value);
    }

    async update(value) {
        if (!value) return;
        if (value.startsWith('http')) {
            this.$out.src = value;
        } else {
            if (!value.startsWith('/')) value = '/' + value;
            this.$out.src = this.data.sets.makeUrl('fetch', { path: value });
        }
    }
}