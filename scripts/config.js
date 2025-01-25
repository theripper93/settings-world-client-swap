import { MODULE_ID, ALTERED_SETTING_IDS } from "./main.js";
import {getSetting, setSetting} from "./settings.js";

const ALLOW_WORLD_TO_CLIENT = false;

export function initConfig() {
    if(!game.user.isGM) return;
    Hooks.on("renderSettingsConfig", (app, html) => {
        const element = html[0] ?? html;

        const settingsFormGroups = element.querySelectorAll('.form-group[data-setting-id]');

        settingsFormGroups.forEach(formGroup => {
            const settingId = formGroup.dataset.settingId;
            if (!settingId) return;
            const setting = game.settings.settings.get(settingId);
            if (!setting) return;
            const altered = ALTERED_SETTING_IDS.includes(settingId);
            const originalScope = altered ? (setting.scope === "world" ? "client" : "world") : setting.scope;
            if (originalScope === "world" && !ALLOW_WORLD_TO_CLIENT) {
                const worldIcon = document.createElement("label");
                worldIcon.innerText = "🌎";
                worldIcon.style.marginRight = "0.3rem";
                worldIcon.style.maxWidth = "1rem";
                formGroup.prepend(worldIcon);
                return;
            }
            const select = document.createElement("select");
            select.style.maxWidth = "3rem";
            select.style.marginRight = "0.3rem";
            if(altered) select.style.border = "2px dotted var(--color-shadow-primary)";
            const worldOption = document.createElement("option");
            worldOption.value = "world";
            worldOption.text = "🌎";
            worldOption.selected = setting.scope === "world";
            select.appendChild(worldOption);
            const clientOption = document.createElement("option");
            clientOption.value = "client";
            clientOption.text = "👤";
            clientOption.selected = setting.scope === "client";
            select.appendChild(clientOption);
            const label = formGroup.querySelector("label");
            formGroup.prepend(select);
            select.addEventListener("change", event => {
                const value = event.target.value;
                const configuration = getSetting("configuration");
                configuration[settingId.replace(".", "")] = value;
                setSetting("configuration", configuration);
                ui.notifications.info(game.i18n.localize("settings-world-client-swap.notification").replace("{setting}", label.textContent).replace("{value}", value));
            });
        });





    });
}