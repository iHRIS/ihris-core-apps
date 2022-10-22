<template>
  <v-container fluid>
    <h2><center>Data Vizualizer</center></h2>
    <v-row>
      <v-col cols="4">
        <v-row>
          <v-col cols="6">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-autocomplete
                    :items="datasets"
                    label="Datasets"
                    v-model="dataset"
                    item-value="name"
                    item-text="display"
                    return-object
                    @change="datasetSelected"
                  ></v-autocomplete>
                </v-row>
                <v-row v-if="dimensions.length > 0"><h3>Dimensions</h3></v-row>
                <v-row v-else-if="dataset.id && dimensions.length == 0"><h3>No Dimensions Available</h3></v-row>
                <v-row>
                  <ul>
                    <draggable
                      :list="dimensions"
                      :move="dragging"
                      :group="{ name: 'people', pull: 'clone', put: false }"
                      animation=650
                    >
                      <li
                        width="600"
                        class="dstfields"
                        style="cursor: move; width: 260px; height: 30px;"
                        v-for="(dimension, i) in dimensions"
                        :key="i"
                      >{{dimension.display}}</li>
                    </draggable>
                  </ul>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
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
                      animation=650
                    >
                      <v-chip v-for="(filter, index) in filters" :key="index" color="black" dark small>
                        {{filter.display}}
                      </v-chip>
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
        </v-row>
        <v-row>
          <v-col cols="12">
            <h2><v-icon>mdi-cog-outline</v-icon> Settings</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ChartSettings @chartSettings='settingsUpdated' />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="8">
        <v-row v-if="showCategory">
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
                  animation=650
                >
                  <v-chip v-for="(cat, index) in categories" :key="index" color="green" dark small>
                    {{cat.display}}
                  </v-chip>
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
                  animation=650
                >
                  <v-chip v-for="(ser, index) in series" :key="index" color="blue" dark small>
                    {{ser.aggsBy.display}}({{ser.display}})
                    <v-btn text icon color="primary" small>
                      <v-icon color="white">mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </v-chip>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="1">
            <v-btn
              color="success"
              @click="buildQuery"
              small
              :disabled="canDisplayChart"
            >
              <v-icon left>mdi-sitemap</v-icon>
              Visualize
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card v-if="displayChart">
              <v-card-text>
                <v-chart class="chart" :option="option" v-if="displayChart" />
                <v-spacer></v-spacer> <v-btn color="success" to="viz2" text>Second Design</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    {{option}}
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
      displayChart: false,
      datasets: [],
      // dataset: {},
      dataset: { name: 'allpractitioners', display: 'Practitioners List (All practitioners)', id: 'ihris-es-report-all-practitioners' },
      dimensions: [],
      // categories: [],
      categories: [{ name: 'cadre', display: 'Cadre', type: 'text' }, { name: 'gender', display: 'Gender', type: 'text' }],
      series: [{ name: 'job', display: 'Job Title', type: 'text', aggsBy: { name: 'value_count', display: 'CNT' } }],
      filters: [],
      aggregations: [{
        name: 'value_count',
        display: 'CNT'
      }, {
        name: 'sum',
        display: 'SUM'
      }, {
        name: 'avg',
        display: 'AVG'
      }],
      showChartsList: false,
      chart: { name: 'bar', icon: 'mdi-chart-bar', title: 'Bar Chart', description: 'Presents data with rectangular bars at heights or lengths proportional to the values they represent' },
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
        series: []
      }
    }
  },
  methods: {
    buildQuery () {
      const query = {
        size: 0
      }
      let seriesField = this.series[0].name
      if (this.series[0].type === 'text') {
        seriesField += '.keyword'
      }
      if (this.categories.length > 0) {
        query.aggs = {
          categories: {}
        }
        if (this.categories.length === 1) {
          const category = this.categories[0]
          let field = category.name
          if (category.type === 'text') {
            field += '.keyword'
          }
          query.aggs.categories.terms = {
            field
          }
        } else {
          query.aggs.categories.multi_terms = {
            terms: []
          }
          for (const category of this.categories) {
            let field = category.name
            if (category.type === 'text') {
              field += '.keyword'
            }
            query.aggs.categories.multi_terms.terms.push({
              field
            })
          }
        }
        query.aggs.categories.aggs = {
          series: {}
        }
        if (this.series[0].aggsBy.name === 'value_count') {
          query.aggs.categories.aggs.series.terms = {
            field: seriesField,
            order: { _key: 'asc' },
            min_doc_count: 0
          }
        } else {
          const aggBy = this.series[0].aggsBy.name
          query.aggs.categories.aggs.series[aggBy] = { field: seriesField }
        }
      } else {
        query.aggs = {
          series: {
            terms: {
              field: seriesField,
              order: { _key: 'asc' },
              min_doc_count: 0
            }
          }
        }
      }
      this.displayChart = true
      query.reportOptions = {
        locationBasedConstraint: true
      }
      this.getData(query)
    },
    getData (query) {
      const url = `/es/${this.dataset.name}/_search?filter_path=aggregations`
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      })
        .then((response) => {
          response
            .json()
            .then((data) => {
              console.info(JSON.stringify(data, 0, 2))
              this.parseResults(data)
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    parseResults (results) {
      const level1Cat = []
      let level2Cat = []
      const keys = {}
      const series = {}
      if (results.aggregations.categories) {
        for (const bucket of results.aggregations.categories.buckets) {
          if (Array.isArray(bucket.key)) {
            if (!keys[bucket.key[0]]) {
              keys[bucket.key[0]] = []
            }
            keys[bucket.key[0]].push(bucket.key[1])
          } else {
            level1Cat.push(bucket.key)
          }
          if (bucket.series.buckets) {
            for (const value of bucket.series.buckets) {
              let name = value.key
              if (value.key_as_string) {
                name = value.key_as_string
              }
              if (!series[name]) {
                series[name] = []
              }
              series[name].push(value.doc_count)
            }
          } else if (bucket.series.value) {
            if (!series[this.series[0].display]) {
              series[this.series[0].display] = []
            }
            series[this.series[0].display].push(bucket.series.value)
          }
        }
        if (Object.keys(keys).length > 0) {
          for (const key in keys) {
            level2Cat = [...level2Cat, ...keys[key]]
            level1Cat.push(key)
          }
        }
      } else if (results.aggregations.series) {
        if (!series[this.series[0].display]) {
          series[this.series[0].display] = []
        }
        if (results.aggregations.series.buckets) {
          for (const bucket of results.aggregations.series.buckets) {
            level1Cat.push(bucket.key)
            series[this.series[0].display].push({
              name: bucket.key,
              value: bucket.doc_count
            })
          }
        } else if (results.aggregations.series.value) {
          series[this.series[0].display].push({
            name: this.series[0].display,
            value: results.aggregations.series.value
          })
        }
      }
      console.log(level1Cat)
      console.log(level2Cat)
      console.log(series)
      this.option.series = []
      for (const seriesName in series) {
        this.option.series.push({
          name: seriesName,
          type: this.chart.name,
          data: series[seriesName]
        })
      }
    },
    dragging (evt) {
      if (evt.to.id === 'categories' && this.categories.length > 1) {
        return false
      }
      if (evt.to.id === 'series') {
        if (this.series.length > 0) {
          return false
        }
        if (!evt.draggedContext.element.aggsBy) {
          if (evt.draggedContext.element.type === 'long') {
            const agg = this.aggregations.find((agg) => {
              return agg.name === 'sum'
            })
            if (agg) {
              evt.draggedContext.element.aggsBy = agg
            }
          } else {
            const agg = this.aggregations.find((agg) => {
              return agg.name === 'value_count'
            })
            if (agg) {
              evt.draggedContext.element.aggsBy = agg
            }
          }
        }
      }
    },
    datasetSelected () {
      fetch('/es/listFields/' + this.dataset.name + '?id=' + this.dataset.id).then((response) => {
        response.json().then((fields) => {
          this.dimensions = fields
        })
      }).catch((err) => {
        console.log(err)
      })
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
  components: {
    draggable,
    ChartsList,
    VChart,
    ChartSettings
  },
  computed: {
    showCategory () {
      if (this.chart.name === 'pie') {
        return false
      }
      return true
    },
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
    fetch('/es/indices').then((response) => {
      response.json().then((indices) => {
        this.datasets = indices
      })
    }).catch((err) => {
      console.log(err)
    })
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
