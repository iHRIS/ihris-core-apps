<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card>
          <v-card-text>
            <v-row>
              <v-autocomplete
                :items="datasets"
                label="Datasets"
                v-model="dataset"
                return-object
                @change="datasetSelected"
              ></v-autocomplete>
            </v-row>
            <v-row v-if="dimensions.length > 0"><h3>Dimensions</h3></v-row>
            <v-row>
              <ul>
                <draggable
                  :list="dimensions"
                  :move="dragging"
                  :group="{ name: 'people', pull: 'clone', put: false }"
                  animation=150
                >
                  <li
                    width="600"
                    class="dstfields"
                    style="cursor: move; width: 260px; height: 30px;"
                    v-for="(dimension, i) in dimensions"
                    :key="i"
                  >{{dimension}}</li>
                </draggable>
              </ul>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card style="height: 100%">
          <v-card-text>
            <v-card shaped>
              <v-card-title>
                Filters
              </v-card-title>
              <v-card-text>
                <draggable
                  :list="filters"
                  :move="dragging"
                  id="filters"
                  group="people"
                  animation=150
                >
                  <v-chip v-for="(filter, index) in filters" :key="index" color="black" dark small>{{filter}}</v-chip>
                </draggable>
              </v-card-text>
            </v-card>
            <v-divider></v-divider>
            <v-card shaped>
              <v-card-title>
                Charts
                <v-btn
                  dark
                  icon
                  color="blue"
                  @click="showChartsList = true"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="2">
                    <v-icon x-large color="purple">
                      {{chart.icon}}
                    </v-icon>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="9">
                    <b>{{chart.title}}</b>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="1">Category</v-col>
            &nbsp;
            <v-col cols="10">
            <v-card width="498" height="48" rounded>
              <v-card-text>
                <draggable
                  id="categories"
                  :list="categories"
                  :move="dragging"
                  group="people"
                  animation=150
                >
                  <v-chip v-for="(cat, index) in categories" :key="index" color="green" dark small>{{cat}}</v-chip>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1">Series</v-col>
            &nbsp;
          <v-col cols="7">
            <v-card width="498" height="48">
              <v-card-text>
                <draggable
                  :list="series"
                  :move="dragging"
                  id="series"
                  group="people"
                  animation=150
                >
                  <v-chip v-for="(ser, index) in series" :key="index" color="blue" dark small>{{ser}}</v-chip>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="1">
            <v-btn color="success" @click="displayChart=true" small :disabled="canDisplayChart"><v-icon left>mdi-sitemap</v-icon>Visualize</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card v-if="displayChart">
              <v-card-text>
                <v-chart class="chart" :option="option" v-if="displayChart" />
                <h2><v-icon>mdi-cog-outline</v-icon> Settings</h2>
                <ChartSettings @chartSettings='settingsUpdated' />
                <v-spacer></v-spacer> <v-btn color="success" to="viz1" text>First Design</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <ChartsList :activeChart="chart" :showChartsList="showChartsList" @close="hideChartsList" @chartSelected='chartSelected'/>
  </v-container>
</template>
<script>
import draggable from 'vuedraggable'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import ChartsList from './ChartsList.vue'
import ChartSettings from './settings/ChartSettings.vue'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

export default {
  data () {
    return {
      displayChart: true,
      datasets: [{
        text: 'Practitioners List',
        id: '1234'
      }, {
        text: 'Sent Messages',
        id: '6734'
      }],
      dataset: {},
      dimensions: [],
      categories: [],
      series: [],
      filters: [],
      showChartsList: false,
      chart: {},
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        title: {
          show: true,
          text: 'My Chart',
          textAlign: 'auto',
          left: 'center',
          textStyle: {}
        },
        series: [
          {
            name: 'Providers by cadre',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: 'Dentist' },
              { value: 310, name: 'Radiograph' },
              { value: 234, name: 'Surgeon' },
              { value: 135, name: 'Pharmacist' },
              { value: 1548, name: 'Therapist' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    dragging (evt) {
      if (evt.to.id === 'categories' && this.categories.length > 1) {
        return false
      }
      if (evt.to.id === 'series' && this.series.length > 1) {
        return false
      }
    },
    datasetSelected () {
      this.categories = []
      this.series = []
      this.filters = []
    },
    hideChartsList () {
      this.showChartsList = false
    },
    chartSelected (chart) {
      this.chart = chart
    },
    settingsUpdated (setting) {
      for (const set in setting) {
        this.option[set] = setting[set]
      }
    }
  },
  watch: {
    dataset (val) {
      if (val.id === '1234') {
        this.dimensions = [
          'Gender',
          'Cadre',
          'Fullname',
          'Facility',
          'District',
          'Regions',
          'Phone'

        ]
      } else if (val.id === '6734') {
        this.dimensions = [
          'Date Started',
          'Phone',
          'Send Status',
          'Fullname',
          'Workflow',
          'Gender'
        ]
      }
    }
  },
  components: {
    draggable,
    ChartsList,
    VChart,
    ChartSettings
  },
  computed: {
    canDisplayChart () {
      if (this.chart.name && (this.series.length > 0 || this.categories.length > 0)) {
        return false
      }
      return true
    }
  },
  created () {
    if (this.datasets.length > 0) {
      this.dataset = this.datasets[0]
    }
  }
}
</script>
<style scoped>
  .dstfields:hover {
    background-color: antiquewhite;
  }
  .chart {
    height: 400px;
  }
</style>
