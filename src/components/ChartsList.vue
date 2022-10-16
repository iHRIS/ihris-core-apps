<template>
  <v-dialog
    persistent
    transition="dialog-top-transition"
    v-model="show"
    width="800px"
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
        height="20"
      >
        <v-toolbar-title style="font-size: 14px">
          Select Chart
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click.native="close" style="cursor: pointer">mdi-close</v-icon>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="4" v-for="(chart, index) in charts" :key="index">
            <v-list class="chart">
                <v-list-item>
                  <v-list-item-content>
                    <v-row @click="selected(index)" :class="{activeChart: chart.name === activeChart.name}">
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
        name: 'bar',
        icon: 'mdi-chart-bar',
        title: 'Bar Chart',
        description: 'Presents data with rectangular bars at heights or lengths proportional to the values they represent'
      }, {
        name: 'pie',
        icon: 'mdi-chart-pie',
        title: 'Pie Chart',
        description: 'Show how a total amount is divided between levels of a categorical variable as a circle divided into radial slices'
      }, {
        name: 'donut',
        icon: 'mdi-chart-donut',
        title: 'Donut',
        description: 'Show information that changes over time'
      }, {
        name: 'line',
        icon: 'mdi-chart-line',
        title: 'Line Chart',
        description: 'Show information that changes over time'
      }, {
        name: 'area',
        icon: 'mdi-chart-areaspline',
        title: 'Area',
        description: 'Show information that changes over time'
      }, {
        name: 'stacked-area',
        icon: 'mdi-chart-line-stacked',
        title: 'Stacked Area',
        description: 'Show information that changes over time'
      }, {
        name: 'radar',
        icon: 'mdi-radar',
        title: 'Radar',
        description: 'Show information that changes over time'
      }, {
        name: 'gauge',
        icon: 'mdi-gauge',
        title: 'Gauge',
        description: 'Show information that changes over time'
      }, {
        name: 'scatter',
        icon: 'mdi-chart-scatter-plot',
        title: 'Scatter',
        description: 'Show information that changes over time'
      }, {
        name: 'map',
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
