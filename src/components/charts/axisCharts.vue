<template>
  <div></div>
</template>
<script>
import { eventBus } from '@/main'
export default {
  props: ['series', 'categories', 'chart', 'query', 'options', 'chartOptions', 'dataset'],
  data () {
    return {
      data: '',
      option: {}
    }
  },
  watch: {
    options (val) {
      this.option = val
    }
  },
  computed: {
    dataQuery: {
      get () {
        return this.query
      },
      set (value) {
        this.$emit('update:query', value)
      }
    }
  },
  methods: {
    buildQuery () {
      if (this.series.length === 0) return
      this.data = ''
      let seriesField = this.series[0].name
      if (this.series[0].type === 'text') {
        seriesField += '.keyword'
      }
      if (this.categories.length > 0) {
        this.dataQuery.aggs = {
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
          this.dataQuery.aggs.categories.composite = {
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
          this.dataQuery.aggs.categories.composite = {
            size: 1000,
            sources: terms
          }
        }
        this.dataQuery.aggs.categories.aggs = {
          series: {}
        }
        if (this.series[0].aggsBy.name === 'value_count' && this.chart.type !== 'pie') {
          this.dataQuery.aggs.categories.aggs.series.terms = {
            field: seriesField,
            order: { _key: 'asc' },
            // min_doc_count: 0,
            size: 2000000
          }
        } else {
          const aggBy = this.series[0].aggsBy.name
          this.dataQuery.aggs.categories.aggs.series[aggBy] = { field: seriesField }
        }
      } else {
        const terms = {}
        terms[this.series[0].name] = {
          terms: {
            field: seriesField
          }
        }
        this.dataQuery.aggs = {
          series: {
            composite: {
              size: 1000,
              sources: [terms]
            }
          }
        }
      }
      this.getData(this.dataQuery).then(() => {
        this.parseResults()
      })
    },
    getData () {
      return new Promise((resolve, reject) => {
        let category = 'categories'
        if (this.maxCategories === 0) {
          category = 'series'
        }
        const url = `/es/${this.dataset.name}/_search?filter_path=aggregations`
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.dataQuery)
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
                  this.dataQuery.aggs[category].composite.after = data.aggregations[category].after_key
                  this.getData().then(() => {
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
            if (this.chart.hasAxis) {
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
      let xAxisSettings = {}
      if (this.option.xAxis && this.option.xAxis.length > 0) {
        xAxisSettings = JSON.parse(JSON.stringify(this.option.xAxis[0]))
        delete xAxisSettings.data
      }
      let yAxisSettings = {}
      if (this.option.yAxis) {
        yAxisSettings = xAxisSettings = JSON.parse(JSON.stringify(this.option.yAxis))
      }
      this.option.xAxis = []
      this.option.yAxis = {}
      this.option.series = []
      if (level1Cat && level1Cat.length > 0 && this.chart.hasAxis) {
        if (level2Cat && level2Cat.length > 0) {
          this.option.xAxis.push({
            ...xAxisSettings,
            type: 'category',
            data: level2Cat
          })
        }
        if (level1Cat && level1Cat.length > 0) {
          this.option.xAxis.push({
            ...xAxisSettings,
            type: 'category',
            data: level1Cat
          })
        }
        this.option.yAxis = {
          type: 'value',
          ...yAxisSettings
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
      eventBus.$emit('datasetDataReady', this.option)
    }
  },
  created () {
    this.option = this.options
    eventBus.$off('getDatasetData')
    eventBus.$on('getDatasetData', () => {
      this.buildQuery()
    })
  }
}
</script>
