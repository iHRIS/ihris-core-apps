import { createApp } from "vue";
import VueGridLayout from "vue-grid-layout";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { registerPlugins } from "@/plugins";
import { i18n, loadLanguage } from "./i18n";
import fetchDefaults from "fetch-defaults";
import * as Keycloak from "keycloak-js";
import VueCookies from "vue-cookies";
import moment from "moment";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VueGridLayout);
app.use(i18n);
app.config.globalProperties.$moment = moment;
registerPlugins(app);

app.config.globalProperties.$loadLanguage = function (locale) {
  loadLanguage(locale, app);
};

fetch("/config/app").then((response) => {
  response.json().then((data) => {
    store.state.idp = data.idp;
    if (store.state.idp === "keycloak") {
      const initOptions = {
        realm: data.keycloak.realm,
        clientId: data.keycloak.UIClientId,
        url: data.keycloak.baseURL,
        onLoad: "login-required",
      };

      const keycloak = Keycloak(initOptions);
      const Plugin = {
        install(app) {
          app.config.globalProperties.$keycloak = keycloak;
        },
      };

      Plugin.install = (app) => {
        app.config.globalProperties.$keycloak = keycloak;
        Object.defineProperties(app.config.globalProperties, {
          $keycloak: {
            get() {
              return keycloak;
            },
          },
        });
      };
      app.use(Plugin);
      keycloak
        .init({ onLoad: initOptions.onLoad })
        .then((auth) => {
          if (!auth) {
            window.location.reload();
          } else {
            window.fetch = fetchDefaults(fetch, {
              headers: { Authorization: `Bearer ${keycloak.token}` },
            });
            keycloak.loadUserInfo().then((userinfo) => {
              const user = {
                resourceType: "Person",
                id: userinfo.sub,
                meta: {
                  profile: [
                    "http://ihris.org/fhir/StructureDefinition/ihris-person-user",
                  ],
                },
                name: [
                  {
                    use: "official",
                    text: userinfo.name,
                  },
                ],
                active: true,
              };
              if (userinfo.email) {
                user.telecom = [
                  {
                    system: "email",
                    value: userinfo.email,
                  },
                ];
              }
              fetch("/auth", {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(user),
              })
                .then((response) => {
                  response.json().then((data) => {
                    VueCookies.set("userObj", JSON.stringify(data), "infinity");
                    app.mount("#app");
                  });
                })
                .catch((err) => {
                  console.error(err);
                });
            });
            setInterval(() => {
              keycloak.updateToken(70);
            }, 60000);
          }
        })
        .catch(() => {
          alert("Keycloak access failed");
        });
    } else {
      app.config.globalProperties.$keycloak = null;
      app.mount("#app");
    }
  });
});
