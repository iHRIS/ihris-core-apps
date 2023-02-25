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
      hasAxis: true,
      maxCategories: 2,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
      title: 'Bar Chart',
      description: 'Presents data with rectangular bars at heights or lengths proportional to the values they represent'
    }, {
      type: 'pie',
      subType: '',
      icon: 'mdi-chart-pie',
      hasAxis: false,
      maxCategories: 1,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
      title: 'Pie Chart',
      description: 'Compare data in propotion to a whole'
    }, {
      type: 'pie',
      subType: 'donut',
      icon: 'mdi-chart-donut',
      hasAxis: false,
      maxCategories: 1,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
      title: 'Donut',
      description: 'Compare data in propotion to a whole'
    }, {
      type: 'line',
      subType: '',
      icon: 'mdi-chart-line',
      hasAxis: true,
      maxCategories: 2,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
      title: 'Line Chart',
      description: 'Display data as a series of points'
    }, {
      type: 'line',
      subType: 'area',
      icon: 'mdi-chart-areaspline',
      hasAxis: true,
      maxCategories: 2,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
      title: 'Area',
      description: 'Emphasize the data between an axis and a line'
    }, {
      type: 'gauge',
      subType: '',
      icon: 'mdi-gauge',
      hasAxis: false,
      maxCategories: 0,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
      title: 'Gauge',
      description: 'Show the status of a metric'
    }, {
      type: 'metric',
      subType: '',
      icon: 'mdi-numeric-10-circle',
      hasAxis: false,
      maxCategories: 0,
      maxSeries: 1,
      minCategories: 0,
      minSeries: 0,
      title: 'Metric',
      description: 'Show a calculation as a single number'
    }, {
      type: 'scatter',
      subType: '',
      icon: 'mdi-chart-scatter-plot',
      hasAxis: true,
      maxCategories: 2,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
      title: 'Scatter',
      description: 'Show information that changes over time'
    }, {
      type: 'map',
      subType: '',
      icon: 'mdi-google-maps',
      hasAxis: false,
      maxCategories: 2,
      maxSeries: 1,
      minCategories: 1,
      minSeries: 1,
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
