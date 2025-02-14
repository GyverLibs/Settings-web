import { parseFloatNoNaN } from "@alexgyver/utils";
import InputWidget from "./input";

export default class NumberWidget extends InputWidget {
    constructor(data) {
        super(data, (area) => area.value = parseFloatNoNaN(area.value) + '');
    }
}