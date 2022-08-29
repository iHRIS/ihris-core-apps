<template>
  <div>
  <v-app-bar color="white" app clipped-left clipped-right>
    <a :href="$store.state.coreURL">
      <v-img :src="'/ihrisapp/dictionary/images/' + header.logo" contain max-height="36" max-width="106" />
    </a>
    <v-toolbar-title class="headline ml-2" bottom="true">
      <span v-if="header.title" class="primary--text font-weight-bold">{{ header.title }}</span>
      <span class="secondary--text font-weight-bold" v-if="header.site"> | {{ header.site }}</span>
    </v-toolbar-title>
    <v-spacer v-if=$store.state.security_off></v-spacer>
    <div class="error font-weight-bold white--text" dark v-if="$store.state.security_off">
      Security has been disabled for remote configuration and modules!  <br />
      This should only be done during development.
    </div>
    <v-spacer></v-spacer>
    <div>Welcome <span v-if="$store.state.user.loggedin">, {{ $store.state.user.name }}</span></div>
    <v-spacer></v-spacer>
    <v-progress-circular
      indeterminate
      v-if="!header.title"
      color="primary"
    ></v-progress-circular>
    <v-btn icon :href="$store.state.coreURL" title="Home">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn icon title="Help">
      <v-icon>mdi-help</v-icon>
    </v-btn>
    <div>
      <!-- <language-switcher /> -->
    </div>
    <template v-if="$store.state.user.loggedin">
      <v-btn  small fab dark @click="logout" title="Logout" :loading="loading" :disabled="loading">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
    <v-overlay :value="idle_countdown">
      <v-card class="secondary lighten-1">
        <v-card-title class="headline warning white--text" primary-title>Idle - Auto Logout</v-card-title>
        <v-card-text class="black--text">You have been idle too long and will be logged out in {{ idle_logout }} seconds.</v-card-text>
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import vuetify from '../plugins/vuetify'
import store from '../store'
import router from '../router'
// import LanguageSwitcher from "@/components/layout/language-switcher";

export default {
  name: 'IhriHeader',
  vuetify,
  store,
  router,
  data: function () {
    return {
      loading: false,
      idle_countdown: false,
      idle_logout: 30,
      header: {
        title: false,
        site: null,
        logo: 'iHRIS5Logo.png',
        auths: []
      },
      footer: {
        links: []
      },
      nav: {
        active: null,
        menu: {},
        auths: []
      }
    }
  },
  onIdle () {
    // if (store.state.user.loggedin) this.logout(null, true)
    if (this.$store.state.user.loggedin) this.idleDialog()
  },
  onActive () {
    this.idle_countdown = false
  },
  methods: {
    idleDialog () {
      this.idle_logout = 30
      this.idle_countdown = true
      const timerId = setInterval(() => {
        if (!this.isAppIdle) return clearInterval(timerId)
        this.idle_logout -= 1
        if (this.idle_logout < 1) {
          clearInterval(timerId)
          this.logout(null, true)
        }
      }, 1000)
    },
    logout (ev, force) {
      if (this.$store.state.idp === 'keycloak') {
        VueCookies.remove('userObj')
        this.$keycloak.logout()
      } else {
        this.loading = true
        fetch('/auth/logout').then(() => {
          this.loading = false
          // this.$store.commit('logout')
          this.$emit('loggedout')
          if (force) {
            this.$store.commit('setMessage', { type: 'warning', text: 'You have been logged out due to inactivity.', timeout: 3600000 })
          } else {
            this.$store.commit('setMessage', { type: 'success', text: 'You have logged out.' })
          }
          window.location = this.$store.state.coreURL
        })
      }
    },
    updateConfig: function () {
      // make sure we're user has been created in session (logged in or not)
      fetch('/auth').then(() => {
        fetch('/config/site').then(response => {
          response.json().then(data => {
            if (Object.prototype.hasOwnProperty.call(data, 'security') && Object.prototype.hasOwnProperty.call(data.security, 'disabled')) {
              this.$store.commit('securityOff', data.security.disabled)
            }
            if (Object.prototype.hasOwnProperty.call(data, 'title')) this.header.title = data.title
            if (Object.prototype.hasOwnProperty.call(data, 'site')) this.header.site = data.site
            if (Object.prototype.hasOwnProperty.call(data, 'logo')) this.header.logo = data.logo
            if (Object.prototype.hasOwnProperty.call(data, 'auth')) {
              this.header.auths = []
              this.nav.auths = []
              for (const id of Object.keys(data.auth)) {
                data.auth[id].id = id
                this.header.auths.push(data.auth[id])
                this.nav.auths.push(data.auth[id])
              }
            }
            if (Object.prototype.hasOwnProperty.call(data, 'user')) {
              if (data.user.loggedin) {
                const user = {
                  name: data.user.name,
                  location: data.user.location,
                  role: data.user.role,
                  reference: data.user.reference,
                  facilityId: data.user.facilityId,
                  physicalLocation: data.user.physicalLocation
                }
                this.$store.commit('login', user)
              } else {
                this.$store.commit('logout')
              }
            }
            if (Object.prototype.hasOwnProperty.call(data, 'nav')) {
              if (Object.prototype.hasOwnProperty.call(data.nav, 'active')) this.nav.active = data.nav.active
              if (Object.prototype.hasOwnProperty.call(data.nav, 'menu')) this.nav.menu = data.nav.menu
              if (Object.prototype.hasOwnProperty.call(data.nav, 'home')) this.nav.home = data.nav.home
            }
          })
        })
      })
    }
  },
  created () {
    this.updateConfig()
  }
}
</script>
