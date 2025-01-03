import { Component } from "@alexgyver/component";
import { WidgetList } from "./widgets/widgets";

export function checkAndAppend(widgets, parent, obj) {
    if (widgets.has(obj.id)) {
        document.dispatchEvent(new CustomEvent("dup_id", { detail: { widget: obj } }));
    } else if (obj.type in WidgetList) {
        let w = new (WidgetList[obj.type])(obj);
        parent.append(w.$root);
        widgets.set(obj.id, w);
    }
}

export function parseFloatNoNaN(str) {
    let f = parseFloat(str);
    return isNaN(f) ? 0 : f;
}

export function intToColor(int) {
    return "#" + Number(int).toString(16).padStart(6, '0');
}

export function Arrow(dir = 'right', size = 20, styles = {}) {
    return Component.make('div', {
        class: 'icon arrow ' + dir,
        style: {
            width: size + 'px',
            height: size + 'px',
            ...styles
        }
    });
}

export function hash(str) {
    let h = new Uint32Array([0]);
    for (let i = 0; i < str.length; i++) {
        h[0] = h[0] + (h[0] << 5) + str.charCodeAt(i);
    }
    return h[0];
}

export function http_post(url, data, progress) {
    return new Promise(res => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) res(xhr.status);
        }
        xhr.upload.onprogress = e => {
            if (e.lengthComputable) progress(parseInt((e.loaded / e.total) * 100));
        }
        xhr.onerror = e => res(0);
        xhr.open('POST', url, true);
        xhr.send(data);
    });
}