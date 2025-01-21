import { initConfig } from "./config.js";
import {showWelcome} from "./lib/welcome.js";
import { getSetting, registerSettings } from "./settings.js";

export const MODULE_ID = "settings-world-client-swap";

export const ALTERED_SETTING_IDS = [];

Hooks.on("init", () => {
    registerSettings();
});

Hooks.on("ready", () => {
    initConfig();
    showWelcome();
});

let registered = false;

function registerFirst() {
    if (registered) return;
    registered = true;
    this.register(MODULE_ID, "configuration", {
        scope: "world",
        config: false,
        default: {},
        type: Object,
    });
}

const registerSetting = ClientSettings.prototype.register;
ClientSettings.prototype.register = function (...args) {
    registerFirst.call(this);
    const [namespace, key, data] = args;
    if (namespace === MODULE_ID) return registerSetting.call(this, ...args);
    const configuration = getSetting("configuration");
    if (configuration[namespace + key] && configuration[namespace + key] !== data.scope) {
        data.scope = configuration[namespace + key];
        ALTERED_SETTING_IDS.push(namespace + "." + key);
    }
    return registerSetting.call(this, ...args);
};
