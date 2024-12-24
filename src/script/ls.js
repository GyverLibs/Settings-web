export default class LS {
    static has(key) {
        return localStorage.hasOwnProperty(key);
    }
    static get(key) {
        return localStorage.getItem(key);
    }
    static remove(key) {
        localStorage.removeItem(key);
    }
    static set(key, val) {
        localStorage.setItem(key, val);
    }
}