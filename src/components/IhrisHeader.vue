<template>
  <div>
    <v-app-bar color="white" app clipped-left clipped-right>
      <a :href="coreURL">
        <img :src="header.logo" style="vertical-align: bottom" />
      </a>
      <v-app-bar-title class="headline ml-2" bottom="true">
        <span v-if="header.title" class="text-blue font-weight-bold">
          {{ header.title }}
        </span>
        <span class="secondary--text font-weight-bold" v-if="header.site">
          | {{ header.site }}</span
        >
      </v-app-bar-title>
      <v-spacer v-if="$store.state.security_off"></v-spacer>
      <div
        class="error font-weight-bold white--text"
        dark
        v-if="$store.state.security_off"
      >
        Security has been disabled for remote configuration and modules! <br />
        This should only be done during development.
      </div>
      <v-spacer></v-spacer>
      <div>
        {{ $t(`App.hardcoded-texts.Welcome`) }}
        <span v-if="$store.state.user.loggedin"
          >, {{ $store.state.user.name }}</span
        >
      </div>
      <v-spacer></v-spacer>
      <v-progress-circular
        indeterminate
        v-if="!header.title"
        color="primary"
      ></v-progress-circular>
      <v-btn icon="mdi-home" title="Home" :href="coreURL" />
      <v-btn icon title="Help">
        <v-icon>mdi-help</v-icon>
      </v-btn>
      <div>
        <language-switcher />
      </div>
      <template v-if="$store.state.user.loggedin">
        <v-btn
          icon
          fab
          dark
          @click="logout"
          title="Logout"
          :loading="loading"
          :disabled="loading"
          color="black"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-overlay v-model="idle_countdown" class="align-center justify-center">
      <v-card>
        <v-toolbar color="warning" class="text-h6 pa-3" height="24">
          Idle - Auto Logout
        </v-toolbar>
        <v-card-text class="black--text"
          >You have been idle too long and will be logged out in
          {{ idle_logout }} seconds.</v-card-text
        >
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import IdleJs from "idle-js";
import LanguageSwitcher from "@/components/language-switcher.vue";

export default {
  name: "IhriHeader",
  props: ["header"],
  data: function () {
    return {
      loading: false,
      idle_countdown: false,
      idle_logout: 30,
      coreURL: "",
    };
  },
  components: {
    LanguageSwitcher,
  },
  methods: {
    idleDialog() {
      this.idle_logout = 30;
      this.idle_countdown = true;
      const timerId = setInterval(() => {
        this.idle_logout -= 1;
        if (this.idle_logout < 1) {
          clearInterval(timerId);
          this.logout(null, true);
        }
      }, 1000);
    },
    logout(ev, force) {
      if (this.$store.state.idp === "keycloak") {
        VueCookies.remove("userObj");
        this.$keycloak.logout();
      } else {
        this.loading = true;
        fetch("/auth/logout").then(() => {
          this.loading = false;
          this.$store.commit("logout");
          this.$emit("loggedout");
          if (force) {
            this.$store.commit("setMessage", {
              type: "warning",
              text: "You have been logged out due to inactivity.",
              timeout: 3600000,
            });
          } else {
            this.$store.commit("setMessage", {
              type: "success",
              text: "You have logged out.",
            });
          }
          window.location = location.href.split("/ihrisapp")[0];
        });
      }
    },
  },
  created() {
    const me = this;
    const idle = new IdleJs({
      idle: 900000,
      events: ["mousemove", "keydown", "mousedown", "touchstart"],
      keepTracking: true,
      startAtIdle: false,

      onIdle() {
        if (me.$store.state.user.loggedin) me.idleDialog();
      },
      onActive() {
        me.idle_countdown = false;
      },
    });
    idle.start();
    this.coreURL = location.href.split("/ihrisapp/")[0];
  },
};
</script>
