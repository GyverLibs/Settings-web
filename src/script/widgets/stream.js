import ImageWidget from "./image";

export default class StreamWidget extends ImageWidget {
    constructor(data) {
        super(data);

        this.$out.src = this.app.base_url + ':82/stream';
    }
}