<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-switch label="Show/Hide" v-model="tooltip.show" @change="updated"></v-switch>
        <v-select
          :items="triggers"
          v-model="tooltip.trigger"
          label="Type of triggering"
          @change="updated"
        ></v-select>
        <v-select
          :items="triggerOn"
          v-model="tooltip.triggerOn"
          label="Type of triggering"
          @change="updated"
        ></v-select>
        <v-select
          :items="order"
          v-model="tooltip.order"
          label="Tooltip Order"
          item-text="name"
          item-value="value"
          @change="updated"
        ></v-select>
        <v-switch label="Show Floating Layer" v-model="tooltip.showContent" @change="updated"></v-switch>
        <v-switch label="Always Show Content" v-model="tooltip.alwaysShowContent" @change="updated"></v-switch>
        <v-expansion-panels multiple focusable>
          <v-expansion-panel>
            <v-expansion-panel-header>Chart Axis Pointer</v-expansion-panel-header>
            <v-expansion-panel-content>
              <ChartAxisPointer @chartAxisPointer='externalSettings' />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Text Style</v-expansion-panel-header>
            <v-expansion-panel-content>
              <TextStyle @textStyle='textStyle' />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import ChartAxisPointer from './ChartAxisPointer.vue'
import TextStyle from './TextStyle.vue'
export default {
  data () {
    return {
      tooltip: {
        show: true,
        showContent: true,
        alwaysShowContent: false,
        position: function (pt) {
          return [pt[0], 130]
        },
        trigger: 'item',
        triggerOn: 'mousemove|click',
        axisPointer: {
          show: false,
          type: 'line',
          label: {
            show: false,
            margin: 3,
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            lineHeight: 12
          },
          triggerTooltip: true,
          value: '',
          handle: {
            show: true,
            size: 45,
            color: '#333'
          }
        },
        textStyle: {},
        order: 'seriesAsc'
      },
      triggers: ['item', 'axis', 'none'],
      triggerOn: ['mousemove', 'click', 'mousemove|click', 'none'],
      order: [
        { name: 'Ascending Order, based on series', value: 'seriesAsc' },
        { name: 'Descending Order, based on series', value: 'seriesDesc' },
        { name: 'Ascending Order, based on values', value: 'valueAsc' },
        { name: 'Ascending Order, based on values', value: 'valueDesc' }]
    }
  },
  methods: {
    externalSettings (setting) {
      this.tooltip[setting.name] = setting.value
      this.updated()
    },
    textStyle (setting) {
      this.tooltip[setting.name] = setting.value
      this.updated()
    },
    updated () {
      this.$emit('chartTooltip', { name: 'tooltip', value: this.tooltip })
    }
  },
  components: {
    ChartAxisPointer,
    TextStyle
  }
}
</script>
