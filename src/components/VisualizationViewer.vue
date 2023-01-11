<template>
  <v-container fluid>
    <v-card v-if="displayChart">
      <v-card-text>
        <v-chart
          :style="{height: height+'px'}"
          :key="rerender"
          :option="option"
          v-if="displayChart"
        />
      </v-card-text>
    </v-card>
    <v-progress-linear
      color="red lighten-2"
      buffer-value="0"
      stream
      height="20"
      v-if="loadingData"
    >Loading Data</v-progress-linear>
  </v-container>
</template>
<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, ScatterChart, RadarChart, GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  props: ['id', 'rerender', 'height'],
  data () {
    return {
      me: this,
      renderSettings: false,
      vizId: '',
      data: '',
      loadingData: false,
      displayChart: false,
      dataset: '',
      dimensions: [],
      categories: [],
      series: [],
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
      chart: { type: 'bar', subType: '', icon: 'mdi-chart-bar', title: 'Bar Chart', description: 'Presents data with rectangular bars at heights or lengths proportional to the values they represent' },
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
    buildFilters () {
      const filter = {
        bool: {
          must: [],
          must_not: []
        }
      }
      for (const category of this.categories) {
        let field = category.name
        if (category.type === 'text') {
          field += '.keyword'
        }
        if (category.defaultFilter !== 'selected') {
          continue
        }
        if (Array.isArray(category.selectedValues)) {
          const terms = {
            terms: {}
          }
          terms.terms[field] = []
          for (const value of category.selectedValues) {
            terms.terms[field].push(value)
          }
          if (category.filterCondition === 'exclude') {
            filter.bool.must_not.push(terms)
          } else {
            filter.bool.must.push(terms)
          }
        }
      }
      for (const series of this.series) {
        let field = series.name
        if (series.type === 'text') {
          field += '.keyword'
        }
        if (series.defaultFilter !== 'selected') {
          continue
        }
        if (Array.isArray(series.selectedValues)) {
          const terms = {
            terms: {}
          }
          terms.terms[field] = []
          for (const value of series.selectedValues) {
            terms.terms[field].push(value)
          }
          if (series.filterCondition === 'exclude') {
            filter.bool.must_not.push(terms)
          } else {
            filter.bool.must.push(terms)
          }
        }
      }
      return filter
    },
    buildQuery () {
      this.data = ''
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
          const term = {}
          term[category.name] = {
            terms: {
              field
            }
          }
          query.aggs.categories.composite = {
            sources: [term]
          }
        } else {
          const terms = []
          for (const category of this.categories) {
            let field = category.name
            if (category.type === 'text') {
              field += '.keyword'
            }
            const term = {}
            term[category.name] = {
              terms: {
                field,
                missing_bucket: true
              }
            }
            terms.push(term)
          }
          query.aggs.categories.composite = {
            size: 1000,
            sources: terms
          }
        }
        query.aggs.categories.aggs = {
          series: {}
        }
        if (this.series[0].aggsBy.name === 'value_count' && this.chart.type !== 'pie') {
          query.aggs.categories.aggs.series.terms = {
            field: seriesField,
            order: { _key: 'asc' },
            // min_doc_count: 0,
            size: 2000000
          }
        } else {
          const aggBy = this.series[0].aggsBy.name
          query.aggs.categories.aggs.series[aggBy] = { field: seriesField }
        }
      } else {
        const terms = {}
        terms[this.series[0].name] = {
          terms: {
            field: seriesField
          }
        }
        query.aggs = {
          series: {
            composite: {
              size: 1000,
              sources: [terms]
            }
          }
        }
      }
      const filter = this.buildFilters()
      query.query = {
        bool: filter.bool
      }
      query.reportOptions = {
        locationBasedConstraint: true
      }
      this.getData(query).then(() => {
        this.parseResults()
      })
    },
    getData (query) {
      return new Promise((resolve, reject) => {
        let category = 'categories'
        if (this.maxCategories === 0) {
          category = 'series'
        }
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
                if (!this.data) {
                  this.data = data
                } else if (data.aggregations[category].buckets && data.aggregations[category].buckets.length > 0) {
                  this.data.aggregations[category].buckets = this.data.aggregations[category].buckets.concat(data.aggregations[category].buckets)
                }
                if (data.aggregations && data.aggregations[category].after_key) {
                  query.aggs[category].composite.after = data.aggregations[category].after_key
                  this.getData(query).then(() => {
                    return resolve()
                  })
                } else {
                  return resolve()
                }
              })
              .catch((err) => {
                console.log(err)
                return reject(err)
              })
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    async parseResults () {
      const level1Cat = []
      let level2Cat = []
      const keys = {}
      const series = {}
      if (this.data.aggregations.categories) {
        for (const bucket of this.data.aggregations.categories.buckets) {
          if (Object.keys(bucket.key).length > 1) {
            const catKeys = Object.keys(bucket.key)
            if (!keys[bucket.key[catKeys[0]]]) {
              keys[bucket.key[catKeys[0]]] = []
            }
            keys[bucket.key[catKeys[0]]].push(bucket.key[catKeys[1]])
          } else {
            if (typeof bucket.key === 'object') {
              const keys = Object.keys(bucket.key)
              for (const key of keys) {
                level1Cat.push(bucket.key[key])
              }
            } else {
              level1Cat.push(bucket.key)
            }
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
            if (this.hasAxis) {
              series[this.series[0].display].push(bucket.series.value)
            } else {
              series[this.series[0].display].push({
                name: bucket.key[Object.keys(bucket.key)[0]],
                value: bucket.series.value
              })
            }
          }
        }
        if (Object.keys(keys).length > 0) {
          for (const key in keys) {
            level2Cat = [...level2Cat, ...keys[key]]
            level1Cat.push(key)
          }
        }
      } else if (this.data.aggregations.series) {
        if (!series[this.series[0].display]) {
          series[this.series[0].display] = []
        }
        if (this.data.aggregations.series.buckets) {
          for (const bucket of this.data.aggregations.series.buckets) {
            // level1Cat.push(bucket.key)
            series[this.series[0].display].push({
              name: bucket.key,
              value: bucket.doc_count
            })
          }
        } else if (this.data.aggregations.series.value) {
          series[this.series[0].display].push({
            name: this.series[0].display,
            value: this.data.aggregations.series.value
          })
        }
      }
      this.option.xAxis = []
      this.option.yAxis = {}
      this.option.series = []
      if (level1Cat && level1Cat.length > 0 && this.hasAxis) {
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
        return opt.type === this.chart.type
      })
      for (const seriesName in series) {
        this.option.series.push({
          name: seriesName,
          type: this.chart.type,
          ...chartOpt,
          data: series[seriesName]
        })
      }
      await this.$nextTick()
      this.loadingData = false
      this.displayChart = true
    },
    chartSelected (chart) {
      this.chart = chart
    },
    getViz () {
      fetch('/fhir/Basic/' + this.vizId).then((response) => {
        response.json()
          .then(async (data) => {
            const datasetExt = data.extension.find((ext) => {
              return ext.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-dataset'
            })
            const datasetName = datasetExt.extension.find((ext) => {
              return ext.url === 'name'
            }).valueString
            const datasetId = datasetExt.extension.find((ext) => {
              return ext.url === 'id'
            }).valueString
            this.dataset = {
              id: datasetId,
              name: datasetName
            }
            await this.getDimensions()
            for (const vizData of data.extension) {
              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-categories') {
                const name = vizData.extension.find((ext) => {
                  return ext.url === 'name'
                })
                const catDim = this.dimensions.find((dim) => {
                  return dim.name === name.valueString
                })
                if (catDim) {
                  let selectedValues = vizData.extension.find((ext) => {
                    return ext.url === 'selectedValues'
                  })
                  if (selectedValues) {
                    try {
                      selectedValues = JSON.parse(window.atob(selectedValues.valueString))
                    } catch (error) {
                      console.log(error)
                    }
                    catDim.selectedValues = selectedValues
                  }
                  const defaultFilter = vizData.extension.find((ext) => {
                    return ext.url === 'defaultFilter'
                  })
                  if (defaultFilter) {
                    catDim.defaultFilter = defaultFilter.valueString
                  }
                  const filterCondition = vizData.extension.find((ext) => {
                    return ext.url === 'filterCondition'
                  })
                  if (filterCondition) {
                    catDim.filterCondition = filterCondition.valueString
                  }
                  this.categories.push(catDim)
                }
              }
              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-series') {
                const name = vizData.extension.find((ext) => {
                  return ext.url === 'name'
                })
                const serDim = this.dimensions.find((dim) => {
                  return dim.name === name.valueString
                })
                const aggsBy = vizData.extension.find((ext) => {
                  return ext.url === 'aggsBy'
                })
                if (aggsBy) {
                  const agg = this.aggregations.find((agg) => {
                    return agg.name === aggsBy.valueString
                  })
                  if (agg) {
                    serDim.aggsBy = agg
                  }
                }
                if (serDim) {
                  let selectedValues = vizData.extension.find((ext) => {
                    return ext.url === 'selectedValues'
                  })
                  if (selectedValues) {
                    try {
                      selectedValues = JSON.parse(window.atob(selectedValues.valueString))
                    } catch (error) {
                      console.log(error)
                    }
                    serDim.selectedValues = selectedValues
                  }
                  const defaultFilter = vizData.extension.find((ext) => {
                    return ext.url === 'defaultFilter'
                  })
                  if (defaultFilter) {
                    serDim.defaultFilter = defaultFilter.valueString
                  }
                  const filterCondition = vizData.extension.find((ext) => {
                    return ext.url === 'filterCondition'
                  })
                  if (filterCondition) {
                    serDim.filterCondition = filterCondition.valueString
                  }
                  this.series.push(serDim)
                }
              }
              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-filters') {
                const fil = this.dimensions.find((dim) => {
                  return dim.name === vizData.valueString
                })
                if (fil) {
                  this.filters.push(fil)
                }
              }
              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-settings') {
                const settings = vizData.valueBase64Binary
                try {
                  this.option = JSON.parse(window.atob(settings))
                } catch (error) {
                  console.log(error)
                }
              }
            }
            this.renderSettings = true
            this.buildQuery()
          })
      })
    },
    getDimensions () {
      return new Promise((resolve, reject) => {
        fetch('/es/listFields/' + this.dataset.name + '?id=' + this.dataset.id).then((response) => {
          response.json().then((fields) => {
            this.dimensions = fields
            return resolve()
          })
        }).catch((err) => {
          console.log(err)
          return reject(err)
        })
      })
    }
  },
  components: {
    VChart
  },
  computed: {
    hasAxis () {
      if (this.chart.type === 'pie' || this.chart.type === 'gauge') {
        return false
      }
      return true
    },
    maxCategories () {
      if (this.chart.type === 'pie') {
        return 1
      }
      if (this.chart.type === 'gauge') {
        return 0
      }
      return 2
    }
  },
  created () {
    if (this.$route.params.id) {
      this.vizId = this.$route.params.id
    } else if (this.id) {
      this.vizId = this.id
    }
    if (this.vizId) {
      this.getViz()
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
