<template>
  <v-dialog
    persistent
    transition="dialog-top-transition"
    v-model="show"
    width="800px"
  >
    <v-card>
      <v-system-bar window color="primary" dark>
        Select Chart Type
        <v-spacer></v-spacer>
        <v-icon @click.native="close" style="cursor: pointer">mdi-close</v-icon>
      </v-system-bar>
      <v-card-text>
        <v-row>
          <v-col cols="4" v-for="(chart, index) in charts" :key="index">
            <v-list class="chart">
                <v-list-item>
                  <v-list-item-content>
                    <v-row @click="selected(index)" :class="{activeChart: chart.type === activeChart.type && chart.subType === activeChart.subType}">
                      <v-col cols="2">
                        <v-icon x-large color="purple">
                          {{chart.icon}}
                        </v-icon>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="9">
                        <div>
                          <b>{{chart.title}}</b>
                        </div>
                        <div style="font-size: 12px">
                          {{chart.description}}
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click='close'
          small
        >close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ['showChartsList', 'activeChart'],
  data () {
    return {
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
    }
  },
  computed: {
    show () {
      return this.showChartsList
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    selected (index) {
      this.$emit('chartSelected', this.charts[index])
      this.$emit('close')
    }
  }
}
</script>
<style>
  .activeChart {
    background-color: aqua;
    font-size: x-large;
    border: 3px solid black;
  }
  .chart :hover {
    cursor: pointer;
    background-color: aliceblue;
  }
</style>
