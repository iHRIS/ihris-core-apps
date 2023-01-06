<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-switch label="Show/Hide" v-model="legend.show" @change="updated"></v-switch>
        <v-select
          :items="types"
          v-model="legend.type"
          label="Type"
          @change="updated"
        ></v-select>
        <v-select
          :items="orientation"
          v-model="legend.orient"
          label="Orientation"
          @change="updated"
        ></v-select>
        <v-select
          :items="aligns"
          v-model="legend.align"
          label="Align"
          @change="updated"
        ></v-select>
        <v-select
          :items="top"
          v-model="legend.top"
          label="Position"
          @change="updated"
        ></v-select>
        <v-text-field
          v-model="legend.itemGap"
          type="number"
          label="Items Gap"
          min="5"
          max="100"
          @input="updated"
        ></v-text-field>
        <v-select
          :items="selections"
          v-model="legend.selectedMode"
          label="Selection Mode"
          @change="updated"
        ></v-select>
        <v-expansion-panels multiple focusable v-model="expandTextStyle">
          <v-expansion-panel>
            <v-expansion-panel-header>Text Style</v-expansion-panel-header>
            <v-expansion-panel-content>
              <TextStyle @textStyle='externalSettings' :values="legend.textStyle" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import TextStyle from './TextStyle.vue'
export default {
  props: ['values'],
  data () {
    return {
      legend: {
        show: true,
        type: 'scroll',
        orient: 'horizontal',
        align: 'auto',
        top: 'bottom',
        itemGap: 10,
        selectedMode: true,
        textStyle: {}
      },
      types: ['plain', 'scroll'],
      aligns: ['auto', 'left', 'right'],
      top: ['bottom', 'middle', 'top'],
      selections: [true, false, 'single', 'multiple'],
      orientation: ['vertical', 'horizontal'],
      expandTextStyle: []
    }
  },
  methods: {
    externalSettings (setting) {
      this.legend[setting.name] = setting.value
      this.updated()
    },
    updated () {
      this.$emit('chartLegend', { name: 'legend', value: this.legend })
    }
  },
  created () {
    for (const index in this.values) {
      this.legend[index] = this.values[index]
    }
    this.expandTextStyle = [0]
    setTimeout(() => {
      this.expandTextStyle = []
    }, 500)
  },
  components: {
    TextStyle
  }
}
</script>
