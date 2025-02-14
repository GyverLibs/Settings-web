export default function parseTable(buffer) {
    if (!(buffer instanceof Uint8Array)) buffer = new Uint8Array(buffer);

    let parse = (markup) => {
        let out = [];
        let byte = 0;

        if (typeof markup == 'string') markup = [markup];

        let makeArray = (val, len, signed = false) => {
            switch (len) {
                case 1: return signed ? new Int8Array(val) : new Uint8Array(val);
                case 2: return signed ? new Int16Array(val) : new Uint16Array(val);
                case 4: return signed ? new Int32Array(val) : new Uint32Array(val);
                case 8: return signed ? new BigInt64Array(val) : new BigUint64Array(val);
            }
        }

        let end = (len) => len > buffer.length - byte;

        for (let x of markup) {
            let len = 0;
            switch (x[0]) {
                case 'i':
                case 'u':
                    len = parseInt(x.slice(1));
                    if (end(len)) break;
                    out.push(makeArray(buffer.slice(byte, byte + len).buffer, len, x[0] == 'i')[0]);
                    break;

                case 'f':
                    len = 4;
                    if (end(len)) break;
                    out.push(new Float32Array(buffer.slice(byte, byte + len).buffer)[0]);
                    break;

                default:
                    out.push(0);
                    break;
            }
            byte += len;
        }
        buffer = buffer.slice(byte, buffer.length);
        return out.length == 1 ? out[0] : out;
    }

    let cols = parse('u1');
    let rows = parse('u2');
    let types = parse(Array(cols).fill('u1'));
    types = types.map(t => [null, 'i1', 'u1', 'i2', 'u2', 'i4', 'u4', 'f', 'i8', 'u8'][t]);
    return [...Array(rows).keys()].map(x => parse(types));
}