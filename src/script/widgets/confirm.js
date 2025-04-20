import { AsyncConfirm } from "../ui/dialog";
import WidgetBase from "./widget";

export default class ConfirmWidget extends WidgetBase {
    constructor(data) {
        super(data, false, false);
        this.text = data.label ?? 'Confirm';
        this.$root = document.createElement('div');
        this.$root.style = 'display: none';
    }

    async update(value) {
        if (typeof value !== 'boolean') this.text = value;
        let res = await AsyncConfirm(this.text);
        this.sendValue(res ? 1 : 0);
    }
}