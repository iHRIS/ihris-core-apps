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
                      @start="dragStart"
                      @end="dragEnd"
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
                      @start="dragStart"
                      @end="dragEnd"
                      :move="dragging"
                      id="filters"
                      group="people"
                      animation=650
                    >
                      <v-chip v-for="(filter, index) in filters" :key="index" color="black" dark small>
                        {{filter.display}}
                        <v-menu
                          offset-y
                          origin="center center"
                          transition="scale-transition"
                          rounded="b-xl"
                          :close-on-content-click="false"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              icon
                              small
                              v-bind="attrs"
                              v-on="on"
                              id="seriesActivator"
                            >
                              <v-icon color="white">mdi-dots-horizontal</v-icon>
                            </v-btn>
                          </template>
                          <v-list rounded>
                            <v-list-item link @click="filters.splice(index, 1)">
                              <v-list-item-icon>
                                <v-icon>mdi-minus-circle</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>Remove</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="move('filters', 'series', index)" :disabled="series.length > 0">
                              <v-list-item-icon>
                                <v-icon>mdi-cursor-move</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>Move to series</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="move('filters', 'categories', index)" :disabled="categories.length > 1">
                              <v-list-item-icon>
                                <v-icon>mdi-cursor-move</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>Move to categories</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-chip>
                      <v-chip v-if="dragArea">Drop Here</v-chip>
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
            <ChartSettings @chartSettings="chartSettings" @generalSettings="generalSettings" />
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
                  @start="dragStart"
                  @end="dragEnd"
                  :move="dragging"
                  group="people"
                  animation=650
                >
                  <v-chip v-for="(cat, index) in categories" :key="index" color="green" dark small>
                    {{cat.display}}
                    <v-menu
                      offset-y
                      origin="center center"
                      transition="scale-transition"
                      rounded="b-xl"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          small
                          v-bind="attrs"
                          v-on="on"
                          id="seriesActivator"
                        >
                          <v-icon color="white">mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list rounded>
                        <v-list-item link @click="categories.splice(index, 1)">
                          <v-list-item-icon>
                            <v-icon>mdi-minus-circle</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('categories', 'series', index)" :disabled="series.length > 0">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to series</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('categories', 'filters', index)">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to filters</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-chip>
                  <v-chip v-if="dragArea & categories.length < 2">Drop Here</v-chip>
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
                  @start="dragStart"
                  @end="dragEnd"
                  :move="dragging"
                  id="series"
                  group="people"
                  animation=650
                >
                  <v-chip v-for="(ser, index) in series" :key="index" color="blue" dark small style="cursor: move">
                    {{ser.aggsBy.display}}({{ser.display}})
                    <v-menu
                      offset-y
                      origin="center center"
                      transition="scale-transition"
                      rounded="b-xl"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          small
                          v-bind="attrs"
                          v-on="on"
                          id="seriesActivator"
                        >
                          <v-icon color="white">mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list rounded>
                        <v-list-group
                          prepend-icon="mdi-sigma"
                          no-action
                        >
                          <template v-slot:activator>
                            <v-list-item-content v-bind="attrs" v-on="on" no-action>
                              <v-list-item-title no-action>Aggregations</v-list-item-title>
                            </v-list-item-content>
                          </template>
                          <v-list-item link>
                            <v-list-item-content>
                              <v-list-item-title @click="changeAgg(index, 'value_count')">Count</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item link v-if="ser.type === 'long'">
                            <v-list-item-content>
                              <v-list-item-title @click="changeAgg(index, 'sum')">Sum</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item link v-if="ser.type === 'long'">
                            <v-list-item-content>
                              <v-list-item-title @click="changeAgg(index, 'avg')">Average</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-group>
                        <v-list-item link @click="series.splice(index, 1)">
                          <v-list-item-icon>
                            <v-icon>mdi-minus-circle</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('series', 'categories', index)" :disabled="categories.length > 1">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to categories</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('series', 'filters', index)">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to filters</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-chip>
                  <v-chip v-if="dragArea && series.length < 1">Drop Here</v-chip>
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
            <v-progress-linear
              color="red lighten-2"
              buffer-value="0"
              stream
              height="20"
              v-if="loadingData"
            >Loading Data</v-progress-linear>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <ChartsList :activeChart="chart" :showChartsList="showChartsList" @close="hideChartsList" @chartSelected='chartSelected' />
  </v-container>
</template>
<script>
import draggable from 'vuedraggable'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, ScatterChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import ChartsList from './ChartsList.vue'
import ChartSettings from './settings/ChartSettings.vue'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  ScatterChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  data () {
    return {
      loadingData: false,
      displayChart: false,
      datasets: [],
      // dataset: {},
      dataset: { name: 'allpractitioners', display: 'Practitioners List (All practitioners)', id: 'ihris-es-report-all-practitioners' },
      dimensions: [],
      // categories: [],
      // series: [],
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
          trigger: 'item'
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
        series: [],
        xAxis: [],
        yAxis: {}
      },
      chartOptions: [],
      dragArea: false
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
      query.reportOptions = {
        locationBasedConstraint: true
      }
      this.getData(query)
    },
    getData (query) {
      this.loadingData = true
      this.displayChart = false
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
    async parseResults (results) {
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
            // level1Cat.push(bucket.key)
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
      this.option.xAxis = []
      this.option.yAxis = {}
      this.option.series = []
      if (level1Cat && level1Cat.length > 0) {
        if (level2Cat && level2Cat.length > 0) {
          this.option.xAxis.push({
            type: 'category',
            data: level2Cat
          })
        }
        if (level1Cat && level1Cat.length > 0) {
          this.option.xAxis.push({
            type: 'category',
            data: level1Cat
          })
        }
        this.option.yAxis = {
          type: 'value'
        }
      } else {
        delete this.option.yAxis
        delete this.option.xAxis
      }
      const chartOpt = this.chartOptions.find((opt) => {
        return opt.type === this.chart.name
      })
      for (const seriesName in series) {
        this.option.series.push({
          name: seriesName,
          type: this.chart.name,
          ...chartOpt,
          data: series[seriesName]
        })
      }
      await this.$nextTick()
      this.loadingData = false
      this.displayChart = true
    },
    move (from, to, position) {
      if (to === 'series') {
        this.setDefaultAgg(this[from][position])
      }
      this[to].push(this[from][position])
      this[from].splice(position, 1)
    },
    changeAgg (position, agg) {
      const aggregation = this.aggregations.find((aggregation) => {
        return aggregation.name === agg
      })
      if (aggregation) {
        this.series[position].aggsBy = aggregation
      }
      document.getElementById('seriesActivator').click()
    },
    dragEnd () {
      this.dragArea = false
    },
    dragStart () {
      this.dragArea = true
      // {
      //   'border-style': 'dashed',
      //   'border-color': 'cadetblue',
      //   height: '30px',
      //   width: 'auto'
      // }
    },
    dragging (evt) {
      if (evt.to.id === 'categories' && this.categories.length > 1) {
        return false
      }
      if (evt.to.id === 'series') {
        if (this.series.length > 0) {
          return false
        }
        this.setDefaultAgg(evt.draggedContext.element)
      }
    },
    setDefaultAgg (component) {
      if (!component.aggsBy) {
        if (component.type === 'long') {
          const agg = this.aggregations.find((agg) => {
            return agg.name === 'sum'
          })
          if (agg) {
            component.aggsBy = agg
          }
        } else {
          const agg = this.aggregations.find((agg) => {
            return agg.name === 'value_count'
          })
          if (agg) {
            component.aggsBy = agg
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
    generalSettings (setting) {
      for (const set in setting) {
        this.option[set] = setting[set]
      }
    },
    chartSettings (setting) {
      let updated = false
      for (const index in this.chartOptions) {
        if (this.chartOptions[index].type === setting.type) {
          for (const stng in setting) {
            this.chartOptions[index][stng] = setting[stng]
            this.option.series[0][stng] = setting[stng]
          }
          // this.chartOptions[index] = setting
          updated = true
        }
      }
      console.error(JSON.stringify(this.option, 0, 2))
      if (!updated) {
        this.chartOptions.push(setting)
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
  watch: {
    showCategory (val) {
      if (!val) {
        this.categories = []
      }
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
