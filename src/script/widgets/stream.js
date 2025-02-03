import ImageWidget from "./image";

export default class StreamWidget extends ImageWidget {
    constructor(data) {
        super(data);

        this.$out.src = this.data.sets.base_url + ':82/stream';

        this.$out.onload = () => {
            document.dispatchEvent(new CustomEvent("changeHeight"));
        }
    }
}