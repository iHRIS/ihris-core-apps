<template>
  <div>
    <v-expansion-panels multiple focusable v-model="expandSettings">
      <v-expansion-panel v-if="chartType === 'bar'">
        <v-expansion-panel-header>Bar Chart</v-expansion-panel-header>
        <v-expansion-panel-content>
          <BarChart @chartSettings="chartSettings" :options="options" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-else-if="chartType === 'pie'">
        <v-expansion-panel-header>Pie Chart</v-expansion-panel-header>
        <v-expansion-panel-content>
          <PieChart @chartSettings="chartSettings" :chartSubType='chartSubType' :options="options" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-else-if="chartType === 'line'">
        <v-expansion-panel-header>Line Chart</v-expansion-panel-header>
        <v-expansion-panel-content>
          <LineChart @chartSettings="chartSettings" :chartSubType='chartSubType' :options="options" />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel v-else-if="chartType === 'gauge'">
        <v-expansion-panel-header>Gauge Chart</v-expansion-panel-header>
        <v-expansion-panel-content>
          <GaugeChart @chartSettings="chartSettings" :options="options" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  props: ['chartType', 'chartSubType', 'options'],
  data () {
    return {
      expandSettings: []
    }
  },
  components: {
    BarChart: () => import(/* webpackChunkName: "bar-chart" */ './Charts/BarChart'),
    PieChart: () => import(/* webpackChunkName: "pie-chart" */ './Charts/PieChart'),
    LineChart: () => import(/* webpackChunkName: "line-chart" */ './Charts/LineChart'),
    GaugeChart: () => import(/* webpackChunkName: "gauge-chart" */ './Charts/GaugeChart')
  },
  methods: {
    chartSettings (setting) {
      this.$emit('chartSettings', setting)
    }
  },
  created () {
    this.expandSettings = [0]
    setTimeout(() => {
      this.expandSettings = []
    }, 500)
  }
}
</script>
