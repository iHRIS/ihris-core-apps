import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      loggedin: false,
      name: ''
    },
    coreURL: ''
  },
  getters: {
  },
  mutations: {
    login (state, user) {
      state.user.loggedin = true
      state.user.name = user.name
      state.user.location = user.location
      state.user.role = user.role
      state.user.userId = user.userId
      state.user.reference = user.reference
      state.user.facilityId = user.facilityId
      state.user.physicalLocation = user.physicalLocation
    },
    logout (state) {
      state.user.loggedin = false
      state.user.name = ''
      state.user.name = ''
      state.user.location = ''
      state.user.role = ''
      state.user.reference = ''
      state.user.facilityId = ''
      state.user.physicalLocation = ''
    },
    securityOff (state, data) {
      state.security_off = data
    }
  },
  actions: {
  },
  modules: {
  }
})
