<template>
  <div>
    <v-expansion-panels multiple focusable v-model="expandSettings">
      <v-expansion-panel v-for='(set, index) in settings' :key='index'>
        <v-expansion-panel-header>{{set.header}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <component :is='set.component' @[set.updateEvent]='externalSettings' v-bind="{values: me[set.optionObject + 'Values']}" />
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
  props: ['chartType', 'option', 'titleValues', 'legendValues', 'tooltipValues', 'axisPointerValues', 'xAxisValues', 'yAxisValues'],
  data () {
    return {
      expandSettings: [],
      me: this,
      settings: [{
        header: 'Chart Title',
        component: 'ChartTitle',
        updateEvent: 'chartTitle',
        optionObject: 'title'
      }, {
        header: 'Chart Legend',
        component: 'ChartLegend',
        updateEvent: 'chartLegend',
        optionObject: 'legend'
      }, {
        header: 'Chart Tooltip',
        component: 'ChartToolTip',
        updateEvent: 'chartTooltip',
        optionObject: 'tooltip'
      }, {
        header: 'Chart Axis Pointer',
        component: 'ChartAxisPointer',
        updateEvent: 'chartAxisPointer',
        optionObject: 'axisPointer'
      }, {
        header: 'Chart X Axis',
        component: 'ChartXaxis',
        updateEvent: 'chartXaxis',
        optionObject: 'xAxis'
      }, {
        header: 'Chart Y Axis',
        component: 'ChartYaxis',
        updateEvent: 'chartYaxis',
        optionObject: 'yAxis'
      }],
      options: {
        tooltip: {
          trigger: 'item'
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
      this.$emit('generalSettings', this.options)
    }
  },
  created () {
    this.expandSettings = [...Array(this.settings.length).keys()].map((k, i) => i)
    setTimeout(() => {
      this.expandSettings = []
    }, 500)
  }
}
</script>
