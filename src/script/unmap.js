export default class unMap extends Map {
    count = 0;

    constructor() {
        super();
    }
    set(id, value) {
        if (id === undefined) id = 0xffffffff + this.count++;
        super.set(id, value);
    }
}