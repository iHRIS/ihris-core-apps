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
    updated () {
      this.$emit('chartYaxis', { name: 'yAxis', value: this.yAxis })
    }
  },
  components: {
    ChartAxis
  }
}
</script>
