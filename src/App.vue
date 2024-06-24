<template>
  <v-app id="top">
    <IhrisHeader app :header="header" @loggedout="updateConfig" />
    <IhrisNavigation app :nav="nav" v-on:loggedin="updateConfig" />
    <v-main>
      <v-snackbar
        v-model="$store.state.message.active"
        :timeout="$store.state.message.timeout"
        :color="$store.state.message.type"
        top
        multi-line
      >
        {{ $store.state.message.text }}
        <v-btn
          dark
          color="blue"
          icon="mdi-close"
          size="small"
          @click="$store.commit('closeMessage')"
        />
      </v-snackbar>
      <v-alert
        v-if="connectionStatus"
        variant="outlined"
        type="warning"
        border="top"
      >
        {{ connectionStatus }}
      </v-alert>
      <router-view :key="$route.fullPath" />
    </v-main>
    <IhrisFooter :footer="footer" />
  </v-app>
</template>
<script>
const { fetch: originalFetch } = window;
import IhrisHeader from "./components/IhrisHeader.vue";
import IhrisFooter from "./components/IhrisFooter.vue";
import IhrisNavigation from "./components/IhrisNavigation.vue";

export default {
  data: function () {
    return {
      connectionStatus: "",
      loading: false,
      idle_countdown: false,
      idle_logout: 30,
      header: {
        title: false,
        site: null,
        logo: "iHRIS5Logo.png",
        auths: [],
      },
      footer: {
        links: [],
      },
      nav: {
        active: null,
        menu: {},
        auths: [],
      },
    };
  },
  components: {
    IhrisHeader,
    IhrisFooter,
    IhrisNavigation,
  },
  methods: {
    updateConfig: function () {
      return new Promise((resolve, reject) => {
        // make sure we're user has been created in session (logged in or not)
        fetch("/auth").then(() => {
          fetch("/config/site")
            .then((response) => {
              response
                .json()
                .then((data) => {
                  this.$store.state.fhirFlattener = data.fhirFlattener;
                  if (
                    Object.prototype.hasOwnProperty.call(data, "security") &&
                    Object.prototype.hasOwnProperty.call(
                      data.security,
                      "disabled"
                    )
                  ) {
                    this.$store.commit("securityOff", data.security.disabled);
                  }
                  if (Object.prototype.hasOwnProperty.call(data, "title"))
                    this.header.title = data.title;
                  if (Object.prototype.hasOwnProperty.call(data, "site"))
                    this.header.site = data.site;
                  if (Object.prototype.hasOwnProperty.call(data, "logo"))
                    this.header.logo = data.logo;
                  if (Object.prototype.hasOwnProperty.call(data, "auth")) {
                    this.header.auths = [];
                    this.nav.auths = [];
                    for (const id of Object.keys(data.auth)) {
                      data.auth[id].id = id;
                      this.header.auths.push(data.auth[id]);
                      this.nav.auths.push(data.auth[id]);
                    }
                  }
                  if (Object.prototype.hasOwnProperty.call(data, "user")) {
                    if (data.user.loggedin) {
                      const user = {
                        name: data.user.name,
                        role: data.user.role,
                        obj: data.user.obj,
                      };
                      this.$store.commit("login", user);
                    } else {
                      this.$store.commit("logout");
                    }
                  }
                  if (Object.prototype.hasOwnProperty.call(data, "nav")) {
                    if (
                      Object.prototype.hasOwnProperty.call(data.nav, "active")
                    )
                      this.nav.active = data.nav.active;
                    if (Object.prototype.hasOwnProperty.call(data.nav, "menu"))
                      this.nav.menu = data.nav.menu;
                    if (Object.prototype.hasOwnProperty.call(data.nav, "home"))
                      this.nav.home = data.nav.home;
                  }
                  if (Object.prototype.hasOwnProperty.call(data, "footer")) {
                    if (
                      Object.prototype.hasOwnProperty.call(data.footer, "links")
                    ) {
                      this.footer.links = [];
                      for (const id of Object.keys(data.footer.links)) {
                        data.footer.links[id].id = id;
                        this.footer.links.push(data.footer.links[id]);
                      }
                    }
                  }
                  return resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    },
  },
  async created() {
    window.fetch = async (...args) => {
      let [resource, config] = args;
      let response = await originalFetch(resource, config);
      if (response.status === 401) {
        console.error("Not loggedin");
        this.connectionStatus = "offline";
        window.location = location.href.split("/ihrisapp")[0];
      } else {
        this.connectionStatus = "";
      }
      return response;
    };
    document.title = "Data Visualizer";
    let query = location.search;
    query = query.substring(1);
    query = query.split("=");
    const index = query.findIndex((qr) => qr === "baseURL");
    if (index !== -1) {
      this.$store.state.coreURL = query[index + 1];
    }
    await this.updateConfig();
    if (!this.$store.state.user.loggedin && this.$store.state.coreURL) {
      window.location = this.$store.state.coreURL;
    }
  },
};
</script>
