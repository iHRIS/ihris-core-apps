<template>
  <v-app id="top">
    <IhrisHeader app :header="header" @loggedout="updateConfig" />
    <v-main>
      <center>
        <p></p>
        <b>iHRIS Translation APP</b>
      </center>
      <router-view />
    </v-main>
    <IhrisFooter :footer="footer" />
  </v-app>
</template>
<script>
import IhrisHeader from './components/IhrisHeader'
import IhrisFooter from './components/IhrisFooter'
export default {
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
  components: {
    IhrisHeader,
    IhrisFooter
  },
  methods: {
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
            if (Object.prototype.hasOwnProperty.call(data, 'footer')) {
              if (Object.prototype.hasOwnProperty.call(data.footer, 'links')) {
                for (const id of Object.keys(data.footer.links)) {
                  data.footer.links[id].id = id
                  this.footer.links.push(data.footer.links[id])
                }
              }
            }
          })
        })
      })
    }
  },
  created () {
    this.updateConfig()
    let query = location.search
    query = query.substring(1)
    query = query.split('=')
    const index = query.findIndex((qr) => qr === 'baseURL')
    if (index !== -1) {
      this.$store.state.coreURL = query[index + 1]
    }
  }
}
</script>
