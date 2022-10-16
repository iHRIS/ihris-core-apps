<template>
  <div>
    <ChartAxis @chartAxis="externalSettings" />
  </div>
</template>
<script>
import ChartAxis from './ChartAxis.vue'
export default {
  data () {
    return {
      xAxis: {}
    }
  },
  methods: {
    externalSettings (setting) {
      this.xAxis = setting.value
      this.updated()
    },
    updated () {
      this.$emit('chartXaxis', { name: 'xAxis', value: this.xAxis })
    }
  },
  components: {
    ChartAxis
  }
}
</script>
