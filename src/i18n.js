import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import store from "./store";

export const i18n = createI18n({
  locale: "en", // set locale
  fallbackLocale: "en",
  messages: {}, // set locale messages
});

export async function loadLanguage(lang, app) {
  store.state.initializingApp = true;
  fetch(`/translator/getLocale/${lang}`).then((data) => {
    data.json().then((response) => {
      store.state.initializingApp = false;
      if (i18n.mode === "legacy") {
        i18n.global.locale = lang;
      } else {
        i18n.global.locale.value = lang;
      }
      i18n.global.setLocaleMessage(lang, response);
      app.config.globalProperties.$translate = (key) => {
        return key.split(".").reduce((o, i) => {
          if (o) return o[i];
        }, response);
      };
      return nextTick();
    });
  });
}
