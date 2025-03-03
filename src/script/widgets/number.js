import { findFloat } from "@alexgyver/utils";
import InputWidget from "./input";
import { AsyncConfirm } from "../ui/dialog";

export default class NumberWidget extends InputWidget {
    constructor(data) {
        super(data, (v) => findFloat(v), async (v) => {
            v = parseFloat(v);
            if (v < data.min) {
                await AsyncConfirm('Min value: ' + data.min);
                return false;
            }
            if (v > data.max) {
                await AsyncConfirm('Max value: ' + data.max);
                return false;
            }
            return true;
        });

        let min = 'min' in data;
        let max = 'max' in data;
        if (min || max) {
            this.title += ` [${min ? data.min : '..'}, ${max ? data.max : '..'}]`;
        }
    }
}