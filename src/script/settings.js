import { EL } from '@alexgyver/component';
import { codes } from './codes';
import { AsyncConfirm, AsyncPrompt } from './ui/dialog';
import { changeRSSI, makeRSSI } from './ui/rssi';
import { Config } from './config';
import popup from './ui/popup';
import unMap from './unmap';
import Page from './cont/page';
import decodeBson from '@alexgyver/bson';
import { WidgetList } from './widgets/widgets';
import WidgetBase from './widgets/widget';
import { lang } from './lang';
import parseTable from './table';
import WSRequest from './wsrequest';
import renderInfoRow from './ui/info';
import { encodeText, fetchTimeout, hash, httpPost, intToColor, last, LS, waitFrame } from '@alexgyver/utils';
import { Arrow } from './ui/misc';

const anim_s = '.11s';
const anim_ms = 100;
const filefetch_tout = 3000;
const reload_tout = 3000;

function iconGradient(icon, perc) {
    icon.style.background = 'none';
    icon.style.backgroundImage = `linear-gradient(90deg,var(--accent) ${perc}%, var(--font_tint) 0%)`;
}
function iconFill(icon, color) {
    icon.style.background = 'none';
    icon.style.backgroundColor = color;
}

export default class Settings {
    pageStack = [];
    widgets = new unMap();
    ping_t = null;
    update_t = null;
    offline = false;
    transOn = null;
    transOut = null;
    authF = false;
    granted = false;
    firstBuild = true;
    auth = 0;
    rssi = 0;

    //#region constructor
    constructor() {
        console.log("Settings-web v" + SETTINGS_V);

        this.base_url = (typeof SETTINGS_DEV_URL === 'string') ? SETTINGS_DEV_URL : window.location.origin;

        this.$arrow = Arrow('left', 16, {
            display: 'none',
            marginRight: '4px',
        });

        EL.make('div', {
            parent: document.body,
            context: this,
            class: 'main',
            children: [
                {
                    class: 'header',
                    children: [
                        {
                            children: [
                                {
                                    class: 'nav',
                                    children: [
                                        this.$arrow,
                                        {
                                            tag: 'span',
                                            var: 'title'
                                        }
                                    ]
                                },
                                {
                                    class: 'rssi',
                                    var: 'rssi',
                                    html: makeRSSI(),
                                },
                                {
                                    tag: 'span',
                                    class: 'ws',
                                    var: 'ws',
                                    text: 'WS',
                                }
                            ]
                        },
                        {
                            class: 'icon bars menubutton',
                            var: 'menubutton',
                            events: {
                                click: async () => {
                                    iconFill(this.$ota, 'var(--font_tint)');
                                    iconFill(this.$upload, 'var(--font_tint)');
                                    this.$main_col.classList.toggle('hidden');
                                    this.$main_menu.classList.toggle('hidden');
                                    if (this.$main_menu.classList.contains('hidden')) {
                                        this.$menubutton.classList = 'icon bars menubutton';
                                        this.restartUpdates();
                                    } else {
                                        this.$menubutton.classList = 'icon cross menubutton';
                                        this.stopUpdates();
                                        await this.requset('fs');
                                    }
                                },
                            }
                        },
                    ]
                },
                {
                    class: 'hidden',
                    var: 'main_menu',
                    style: { marginTop: '10px' },
                    children: [
                        {
                            class: 'group_col',
                            children: [
                                {
                                    class: 'menu_icons',
                                    children: [
                                        {
                                            class: 'menu_icon',
                                            child: {
                                                class: 'icon moon',
                                                events: {
                                                    click: () => {
                                                        document.body.classList.toggle('theme_dark');
                                                        let dark = document.body.classList.contains('theme_dark');
                                                        LS.set('dark', dark);
                                                        Array.from(document.querySelectorAll('.plot')).map(p => p.dispatchEvent(new CustomEvent("dark_change", { detail: { dark: dark } })));
                                                    },
                                                }
                                            }
                                        },
                                        {
                                            class: 'menu_icon',
                                            child: {
                                                class: 'icon key',
                                                var: 'auth',
                                            }
                                        },
                                        {
                                            tag: 'input',
                                            type: 'file',
                                            var: 'upload_ota',
                                            style: 'display: none',
                                            accept: '.bin',
                                            events: {
                                                change: () => this.uploadOta(this.$upload_ota.files[0]),
                                            }
                                        },
                                        {
                                            tag: 'input',
                                            type: 'file',
                                            var: 'upload_file',
                                            style: 'display: none',
                                            events: {
                                                change: () => this.uploadFile(this.$upload_file.files[0]),
                                            }
                                        },
                                        {
                                            class: 'menu_icon drop_area',
                                            events: {
                                                drop: (e) => this.uploadFile(e.dataTransfer.files[0]),
                                            },
                                            child: {
                                                class: 'icon upload',
                                                title: lang.upload,
                                                var: 'upload',
                                                events: {
                                                    click: () => this.$upload_file.click(),
                                                }
                                            }
                                        },
                                        {
                                            class: 'menu_icon',
                                            child: {
                                                class: 'icon create',
                                                title: lang.create,
                                                var: 'create',
                                                events: {
                                                    click: async () => {
                                                        let path = await AsyncPrompt(lang.create, '/');
                                                        if (path) await this.requset('create', 0, path);
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            class: 'menu_icon drop_area',
                                            events: {
                                                drop: (e) => this.uploadOta(e.dataTransfer.files[0]),
                                            },
                                            child: {
                                                class: 'icon cloud',
                                                title: 'OTA',
                                                var: 'ota',
                                                events: {
                                                    click: () => this.$upload_ota.click(),
                                                }
                                            }
                                        },
                                    ]
                                },
                                {
                                    class: 'fs_cont',
                                    var: 'fs',
                                }
                            ]
                        },
                        {
                            class: 'group group_info',
                            child: {
                                class: 'group_col',
                                children: [
                                    renderInfoRow(this, 'Uptime', 'uptime_i'),
                                    renderInfoRow(this, 'Start', 'start_i'),
                                    renderInfoRow(this, 'MAC', 'mac_i'),
                                    renderInfoRow(this, 'IP', 'ip_i'),
                                    renderInfoRow(this, 'RSSI', 'rssi_i'),
                                ]
                            },
                        },
                        {
                            tag: 'span',
                            var: 'footer',
                            style: `text-align: center;display: block;font-size: 13px;font-style: italic;margin-top: 18px;opacity: 0.7;`,
                        }
                    ],
                },
                {
                    class: 'main_col',
                    var: 'main_col'
                },
            ],
        });

        this.renderFooter();

        this.$arrow.addEventListener('click', () => this.back());
        this.$title.addEventListener('click', () => this.back());

        window.history.pushState({ page: 1 }, "", "");
        window.onpopstate = () => {
            window.history.pushState({ page: 1 }, "", "");
            this.back();
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
            document.body.addEventListener(ev, (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        ['dragenter', 'dragover'].forEach(e => {
            document.body.addEventListener(e, function () {
                document.querySelectorAll('.drop_area').forEach((el) => el.classList.add('active'));
            }, false);
        });
        ['dragleave', 'drop'].forEach(e => {
            document.body.addEventListener(e, function () {
                document.querySelectorAll('.drop_area').forEach((el) => el.classList.remove('active'));
            }, false);
        });

        if (!LS.has('SETTINGS_V') || LS.get('SETTINGS_V') !== SETTINGS_V) {
            LS.remove('cache');
            LS.remove('custom');
            LS.remove('custom_hash');
            LS.set('SETTINGS_V', SETTINGS_V);
        }

        if (LS.has('dark') && LS.get('dark')) document.body.classList.add('theme_dark');

        if (LS.has('auth')) this.auth = LS.get('auth');

        if (LS.has('cache')) {
            if (LS.has('custom')) this.registerCustom(LS.get('custom'));
            this.fromCache = true;
            this.renderUI(LS.get('cache'));
        }

        this.wsr = new WSRequest();
        this.wsr.ws.onchange = (s) => {
            if (s) this.stopUpdates();
            this.$ws.style.display = s ? 'unset' : 'none'
        }
        this.wsr.ondata = (d) => this.parse(d);

        this.load();

        // должно быть в конце
        document.addEventListener('dup_id', (e) => {
            popup(`${lang.dup}: ${e.detail.widget.id} [${e.detail.widget.type}]`);
        });

        window.addEventListener("beforeunload", async () => {
            await this.requset('unfocus');
        });
    }


    //#region registerCustom
    registerCustom(js) {
        let res = js.split(/(class[a-zA-Z\s_\.]*?{)/sg);
        res.shift();
        if (!res.length || res.length % 2 != 0) {
            popup('Custom JS parsing error');
            return;
        }

        let classes = [];
        for (let i = 0; i < res.length; i++) {
            classes.push(res[i] + res[++i]);
        }

        const list = {
            WidgetBase: WidgetBase,
            Component: EL,
            EL: EL,
            AsyncPrompt: AsyncPrompt,
            AsyncConfirm: AsyncConfirm,
            popup: popup,
            intToColor: intToColor,
        };

        let style = document.head.appendChild(document.createElement('style'));
        for (let cls of classes) {
            try {
                Object.keys(list).forEach(x => cls = cls.replaceAll(x, '__list.' + x));
                let clsname = cls.match(/class\s*(\S*)/)[1];
                WidgetList[clsname] = new Function('__list', `return (${cls})`)(list);
                if (WidgetList[clsname].css) style.textContent += WidgetList[clsname].css + '\r\n';
            } catch (e) {
                popup(e);
            }
        }
    }

    //#region updateCache
    updateCache(id, value) {
        function repl(obj) {
            for (let k in obj) {
                if (typeof obj[k] == "object" && obj[k] !== null) repl(obj[k]);
            }
            if (obj.id === id) obj.value = value;
        }

        if (LS.has('cache')) {
            let packet = LS.get('cache');
            repl(packet);
            LS.set('cache', packet);
        }
    }

    //#region timers
    restartPing() {
        this.stopPing();
        if (Config.pingPrd) this.ping_t = setTimeout(() => this.requset('ping'), Config.pingPrd);
    }
    stopPing() {
        clearTimeout(this.ping_t);
    }

    restartUpdates() {
        this.stopUpdates();
        if (Config.updateTout && !this.wsr.opened) {
            this.update_t = setInterval(() => this.requset('update'), Config.updateTout);
        }
    }
    stopUpdates() {
        clearInterval(this.update_t);
    }

    startReload() {
        if (!this.reload) this.reload = setTimeout(() => {
            this.reload = null;
            if (!this.offline) {
                this.offline = true;
                this.authF = false;
                this.stopUpdates();
                this.wsr.ws.reset();
            }
            this.load();
        }, reload_tout);
    }
    stopReload() {
        clearTimeout(this.reload);
        this.reload = null;
        this.offline = false;
    }

    //#region requset
    async load() {
        await this.requset('load', 0, ((new Date).getTime() / 1000 | 0).toString(16));
    }

    async requset(action, id = null, value = null) {
        this.restartPing();
        let packet;

        if (this.wsr.ws.connected() && action != 'load') {
            packet = await this.wsr.request(this.auth, action, id, value, Config.requestTout);
            if (!packet) this.wsr.ws.reset();
        } else {
            if (id !== null) id = id.toString(16);
            if (value !== null) value = encodeURIComponent(value);
            packet = await fetchTimeout(this.makeUrl('settings', { action: action, id: id, value: value }), Config.requestTout);
            if (packet) packet = new Uint8Array(await packet.arrayBuffer());
        }

        if (packet) {
            this.parse(packet);
            if (!this.offline) this.stopReload();
        } else {
            this.startReload();
            this.stopPing();
            changeRSSI(this.$rssi, 0);
        }
        return packet;
    }

    async parse(packet) {
        try {
            packet = decodeBson(packet, codes);
        } catch (e) {
            popup(e);
            return;
        }

        if (packet.rssi) this.rssi = packet.rssi;
        changeRSSI(this.$rssi, this.rssi);

        switch (packet.type) {
            case 'build':
                this.wsr.clear();
                this.restartUpdates();
                this.stopReload();

                if (packet.ws_port) this.wsr.init(this.base_url, packet.ws_port);

                if (packet.custom_hash) {
                    if (!LS.has('custom_hash') || packet.custom_hash != LS.get('custom_hash')) {
                        let res = await fetchTimeout(this.makeUrl('custom.js'), Config.requestTout);
                        if (res) {
                            let js = await res.text();
                            if (js) {
                                LS.set('custom', js);
                                LS.set('custom_hash', packet.custom_hash);
                                window.location.reload();
                            }
                        } else {
                            popup('Custom load error');
                        }
                    }
                } else {
                    LS.remove('custom');
                    LS.remove('custom_hash');
                }

                this.fromCache = false;
                LS.set('cache', packet);

                this.renderUI(packet);

                if (!this.authF) {
                    this.authF = true;
                    if ('granted' in packet) {
                        this.granted = packet.granted;
                        this.$auth.style.backgroundColor = this.granted ? 'var(--accent)' : 'var(--error)';

                        let change = (el) => el.parentNode.style.display = this.granted ? 'block' : 'none';
                        change(this.$ota);
                        change(this.$upload);
                        change(this.$create);

                        if (!this.granted && this.firstBuild) popup('Unauthorized');
                        this.$auth.onclick = async () => {
                            let res = await AsyncPrompt('Password', '');
                            if (res !== null) {
                                LS.set('auth', hash(res));
                                window.location.reload();
                            }
                        };
                    } else {
                        this.$auth.style.backgroundColor = 'var(--font_tint)';
                        this.granted = true;
                    }
                }
                if (packet.gzip) this.$upload_ota.accept = '.gz';
                this.firstBuild = false;
                break;

            case 'update':
                for (let upd of packet.content) {
                    switch (upd.type) {
                        case 'notice': popup(upd.text, false); break;
                        case 'alert': popup(upd.text, true); break;

                        default:
                            if (this.widgets.has(upd.id)) {
                                if ('data' in upd) this.widgets.get(upd.id).update(upd.data);
                                if ('color' in upd) this.widgets.get(upd.id).updateColor(upd.color);
                            }
                            break;
                    }
                }
                break;

            case 'fs':
                this.renderFS(packet);
                break;

            case 'reload':
                setTimeout(() => {
                    if (packet.force) this.pageStack = [];
                    this.load();
                }, 1);
                break;
        }
    }

    //#region UI
    renderUI(json) {
        Config.updateTout = json.update_tout;
        Config.requestTout = json.request_tout;
        Config.sliderTout = json.send_tout;
        document.body.style.setProperty('--accent', intToColor(json.color));

        json.rssi && (this.$rssi_i.innerText = json.rssi + '%');
        const s = json.uptime;
        const d = new Date();
        const utc = d.getTime() - (d.getTimezoneOffset() * 60000);
        this.$uptime_i.innerText = Math.floor(s / 86400) + ':' + new Date(s * 1000).toISOString().slice(11, 19);
        this.$start_i.innerText = new Date(utc - s * 1000).toISOString().split('.')[0].replace('T', ' ');
        this.$mac_i.innerText = json.mac;
        this.$ip_i.innerText = json.local_ip;

        this.renderFooter(json.proj_name, json.proj_link);
        if (!json.title) json.title = 'Settings';
        document.title = json.title;

        let pagesJSON = JSON.stringify(this.pages);
        this.pages = [];
        this.widgets = new unMap();
        EL.clear(this.$main_col);
        Page(-1, json.content, json.title, this);

        if (!this.pages.length) {
            this.pageStack = [];
            popup("No data");
            return;
        }

        let cur = 0;
        if (JSON.stringify(this.pages) === pagesJSON && this.pageStack.length) {
            cur = last(this.pageStack).index;
        } else {
            this.pageStack = [];
        }

        let p = this.pages[cur].page;
        this.$title.innerText = this.pages[cur].title;
        p.style.display = 'block';
        this.$main_col.style.minHeight = p.offsetHeight + 'px';
        this.observe(p);
    }

    back() {
        let dialogs = document.querySelectorAll('.dialog_back');
        if (dialogs.length) {
            dialogs[dialogs.length - 1].remove();
            return;
        }
        if (this.pageStack.length) {
            window.scrollTo(0, 0);
            let e = this.pageStack.pop();
            let right = this.pages[e.index].page;
            right.style.animation = 'shiftRight ' + anim_s;

            let fadein = this.pages[e.parent].page;
            fadein.style.display = 'block';
            fadein.style.animation = 'fadeIn ' + anim_s;
            this.$main_col.style.minHeight = Math.max(fadein.offsetHeight, right.offsetHeight) + 'px';

            this.$title.innerText = this.pages[e.parent].title;
            this.$arrow.style.display = 'block';

            setTimeout(() => {
                right.style.display = 'none';
                this.$main_col.style.minHeight = fadein.offsetHeight + 'px';
                this.observe(fadein);
            }, anim_ms);
        }
        if (!this.pageStack.length) {
            this.$arrow.style.display = 'none';
            this.$title.style.cursor = 'default';
        }
    }

    openPage(e) {
        this.pageStack.push(e);
        let page = this.pages[e.index].page;
        let parent = this.pages[e.parent].page;

        window.scrollTo(0, 0);
        page.style.display = 'block';
        page.style.animation = 'shiftLeft ' + anim_s;
        parent.style.animation = 'fadeOut ' + anim_s;
        this.$main_col.style.minHeight = Math.max(parent.offsetHeight, page.offsetHeight) + 'px';

        this.$title.innerText = this.pages[e.index].title;
        this.$title.style.cursor = 'pointer';
        this.$arrow.style.display = 'block';

        setTimeout(() => {
            parent.style.display = 'none';
            this.$main_col.style.minHeight = page.offsetHeight + 'px';
            this.observe(page);
        }, anim_ms);

        this.requset('menu', e.id);
    }

    observe(page) {
        if (this._resizer) this._resizer.disconnect();
        this._resizer = new ResizeObserver(async () => {
            await waitFrame();
            this.$main_col.style.minHeight = page.offsetHeight + 'px';
        });
        this._resizer.observe(page);
    }

    renderFooter(pname, plink) {
        let copyr = '';
        if (pname) {
            copyr = lang.project + ' ';
            copyr += plink ? `<a style="color: var(--accent)" href="${plink}" target="_blank">${pname}</a>` : `${pname}`;
            copyr += '. ';
        }
        copyr += lang.powered + ` <a style="color: var(--accent)" href="https://github.com/GyverLibs/Settings" target="_blank">Settings</a> v${SETTINGS_V}`;
        this.$footer.innerHTML = copyr;
    }

    //#region renderFS
    renderFS(packet) {
        EL.clear(this.$fs);
        if (packet.error) {
            this.$fs.append(EL.make('div', { class: 'fs_error', text: packet.error }));
        } else {
            let fs = packet.content.trim().split(';');
            for (let ps of fs) {
                ps = ps.split(':');
                let path = ps[0];
                let size = ps[1];
                if (path.length) EL.make('div', {
                    class: 'fs_row',
                    parent: this.$fs,
                    children: [
                        {
                            tag: 'span',
                            class: 'fs_path',
                            text: path,
                            events: {
                                click: () => this.downloadFile(path),
                            }
                        },
                        {
                            class: 'fs_row',
                            style: { padding: '0' },
                            children: [
                                {
                                    tag: 'span',
                                    class: 'fs_size fs_icon',
                                    text: (size / 1024).toFixed(1) + 'k',
                                },
                                {
                                    class: 'icon edit fs_icon',
                                    style: { background: 'var(--accent)' },
                                    events: {
                                        click: async () => {
                                            try {
                                                let res = await this.fetchFile(path);
                                                res = await res.text();
                                                let changed = await AsyncPrompt(lang.edit, res);
                                                if (changed !== null) {
                                                    let data = new FormData();
                                                    let blob = new Blob([changed]);
                                                    data.append('upload', blob, path);
                                                    await this.uploadFormData(path, data);
                                                }
                                            } catch (e) {
                                                popup(e);
                                            }
                                        }
                                    }
                                },
                                {
                                    class: 'icon cross fs_icon',
                                    style: { width: '17px', height: '17px', background: 'var(--error)' },
                                    events: {
                                        click: async () => {
                                            if (await AsyncConfirm(`${lang.remove} ${path}?`)) {
                                                this.removeFile(path);
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                });
            }

            let flash_back = packet.total ? (`linear-gradient(90deg,var(--accent) ${packet.used / packet.total * 100}%, var(--shadow_light) 0%)`) : `linear-gradient(var(--error),var(--error))`;
            let flash_text = packet.total ? (`Flash: ${(packet.used / 1000).toFixed(2)}/${(packet.total / 1000).toFixed(2)} kB [${Math.round(packet.used / packet.total * 100)}%]`) : 'FS Error';

            EL.make('div', {
                parent: this.$fs,
                class: 'fs_info',
                style: {
                    backgroundImage: flash_back,
                },
                text: flash_text,
            });
        }
    }

    //#region FS
    async removeFile(path) {
        await this.requset('remove', 0, path);
    }
    async fetchFile(path) {
        this.stopPing();
        let res = await fetchTimeout(this.makeUrl('fetch', { path: path }), filefetch_tout);
        this.restartPing();

        if (!res) popup(lang.fetch_err);
        return res;
    }
    async downloadFile(path) {
        try {
            let link = document.createElement('a');
            let name = path.split('/').slice(-1)[0];
            let res = await this.fetchFile(path);

            if (name.endsWith('.tbl')) {
                name = name.split('.tbl')[0] + '.csv';
                let table = parseTable(await res.arrayBuffer());
                table = table.map(row => row.join(';')).join('\r\n').replaceAll('.', ',');
                let bytes = encodeText(table);
                let blob = new Blob([bytes], { type: "text/plain" });
                link.href = window.URL.createObjectURL(blob);
            } else {
                res = await res.blob();
                link.href = window.URL.createObjectURL(res);
            }

            link.download = name;
            link.click();
        } catch (e) {
            popup(e);
        }
    }
    async uploadFile(file) {
        this.$upload_file.value = "";
        let path = await AsyncPrompt(lang.upload, '/' + file.name);
        if (!path) return;

        let data = new FormData();
        data.append('upload', file);
        this.uploadFormData(path, data);
    }
    async uploadFormData(path, data) {
        let ok = false;

        this.stopPing();
        try {
            ok = await httpPost(this.makeUrl('upload', { path: path }), data, (perc) => iconGradient(this.$upload, perc));
        } catch (e) { }
        this.restartPing();

        iconFill(this.$upload, ok ? 'var(--font_tint)' : 'var(--error)');
        popup(ok ? lang.upl_done : lang.upl_error, !ok);
        if (ok) await this.requset('fs');
    }
    async uploadOta(file) {
        if (!file.name.endsWith(this.$upload_ota.accept)) return;
        if (!await AsyncConfirm(lang.ota)) return;

        this.$upload_ota.value = "";

        let data = new FormData();
        data.append('ota', file);
        let ok = false;

        this.stopPing();
        try {
            ok = await httpPost(this.makeUrl('ota'), data, (perc) => iconGradient(this.$ota, perc));
        } catch (e) { }
        this.startReload();

        iconFill(this.$ota, ok ? 'var(--font_tint)' : 'var(--error)');
        popup(ok ? lang.ota_done : lang.ota_error, !ok);
    }

    //#region utils
    makeUrl(cmd, params = {}) {
        if (this.auth) params.auth = this.auth.toString(16);
        let url = this.base_url + '/' + cmd;
        let first = true;
        for (let p in params) {
            if (params[p] === null) continue;
            url += first ? '?' : '&';
            first = false;
            url += (p + '=' + params[p]);
        }
        return url;
    }
};