import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      loggedin: false,
      name: ''
    },
    coreURL: '',
    snackbar: {
      enabled: false,
      color: 'primary',
      text: ''
    },
    charts: [{
      type: 'bar',
      subType: '',
      icon: 'mdi-chart-bar',
      title: 'Bar Chart',
      description: 'Presents data with rectangular bars at heights or lengths proportional to the values they represent'
    }, {
      type: 'pie',
      subType: '',
      icon: 'mdi-chart-pie',
      title: 'Pie Chart',
      description: 'Compare data in propotion to a whole'
    }, {
      type: 'pie',
      subType: 'donut',
      icon: 'mdi-chart-donut',
      title: 'Donut',
      description: 'Compare data in propotion to a whole'
    }, {
      type: 'line',
      subType: '',
      icon: 'mdi-chart-line',
      title: 'Line Chart',
      description: 'Display data as a series of points'
    }, {
      type: 'line',
      subType: 'area',
      icon: 'mdi-chart-areaspline',
      title: 'Area',
      description: 'Emphasize the data between an axis and a line'
    }, {
      type: 'gauge',
      subType: '',
      icon: 'mdi-gauge',
      title: 'Gauge',
      description: 'Show the status of a metric'
    }, {
      type: 'metric',
      subType: '',
      icon: 'mdi-gauge',
      title: 'Metric',
      description: 'Show a calculation as a single number'
    }, {
      type: 'scatter',
      subType: '',
      icon: 'mdi-chart-scatter-plot',
      title: 'Scatter',
      description: 'Show information that changes over time'
    }, {
      type: 'map',
      subType: '',
      icon: 'mdi-google-maps',
      title: 'Open as Map',
      description: 'Show information that changes over time'
    }]
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
