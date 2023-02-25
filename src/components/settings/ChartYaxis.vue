<template>
  <div>
    <ChartAxis @chartAxis="externalSettings" :values="values" />
  </div>
</template>
<script>
import ChartAxis from './ChartAxis.vue'
export default {
  props: ['values'],
  data () {
    return {
      yAxis: {}
    }
  },
  methods: {
    externalSettings (setting) {
      this.yAxis = setting.value
      this.updated()
    },
    setDefaults () {
      this.yAxis.type = 'value'
    },
    updated () {
      if (!this.values || this.values.length === 0) {
        this.setDefaults()
      }
      this.$emit('chartYaxis', { name: 'yAxis', value: this.yAxis })
    }
  },
  components: {
    ChartAxis
  }
}
</script>
