<template>
  <div>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>Chart Title</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartTitle @chartTitle='externalSettings' />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Chart Legend</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartLegend @chartLegend='externalSettings' />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Chart Tooltip</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartToolTip @chartTooltip='externalSettings' />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Chart Axis Pointer</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartAxisPointer @chartAxisPointer='externalSettings' />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Chart X Axis</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartXaxis @chartXaxis='externalSettings' />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Chart Y Axis</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartYaxis @chartYaxis='externalSettings' />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import ChartTitle from './ChartTitle.vue'
import ChartLegend from './ChartLegend.vue'
import ChartToolTip from './ChartToolTip.vue'
import ChartAxisPointer from './ChartAxisPointer.vue'
import ChartXaxis from './ChartXaxis.vue'
import ChartYaxis from './ChartYaxis.vue'
export default {
  data () {
    return {
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        title: {},
        axisPointer: {},
        xAxis: {}
      }
    }
  },
  components: {
    ChartTitle,
    ChartLegend,
    ChartToolTip,
    ChartAxisPointer,
    ChartXaxis,
    ChartYaxis
  },
  methods: {
    externalSettings (setting) {
      this.options[setting.name] = setting.value
      this.$emit('chartSettings', this.options)
      console.error(JSON.stringify(this.options, 0, 2))
    }
  }
}
</script>
