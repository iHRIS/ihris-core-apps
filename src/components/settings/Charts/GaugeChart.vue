<template>
  <div>
    <v-select
      :items="colorBy"
      v-model="settings.colorBy"
      label="Color By"
      @change="updated"
    ></v-select>
    <v-text-field
      v-model="radius"
      type="number"
      label="Radius of gauge"
      min="0"
      max="100"
      @input="radiusChanged"
    ></v-text-field>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.startAngle"
          type="number"
          label="Start angle of gauge chart"
          min="-360"
          max="360"
          @input="updated"
        ></v-text-field>
      </template>
      <span>The direct right side of circle center is 0 degree, the right above it is 90 degree, the direct left side of it is 180 degree</span>
    </v-tooltip>
    <v-text-field
      v-model="settings.endAngle"
      type="number"
      label="End angle of gauge chart"
      min="-360"
      max="360"
      @input="updated"
    ></v-text-field>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-switch
          v-bind="attrs"
          v-on="on"
          label="Clockwise"
          v-model="settings.clockwise"
          @change="updated"
        />
      </template>
      <span>Whether the scale in gauge chart increases clockwise</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.min"
          type="number"
          label="Minimum value"
          min="-10000"
          max="10000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>The minimum data value</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.max"
          type="number"
          label="Maximum value"
          min="-10000"
          max="10000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>The maximum data value</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.splitNumber"
          type="number"
          label="Split number"
          min="1"
          max="10000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>The number of split segments of gauge chart scale</span>
    </v-tooltip>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>Progress</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="12">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-switch
                    v-bind="attrs"
                    v-on="on"
                    label="Show progress"
                    v-model="settings.progress.show"
                    @change="updated"
                  />
                </template>
                <span>Whether to show the progress of gauge chart</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="settings.progress.width"
                type="number"
                label="Width of progress"
                min="0"
                max="200"
                @input="updated"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-expansion-panels multiple focusable v-bind="attrs" v-on="on">
                    <v-expansion-panel>
                      <v-expansion-panel-header>Pointer Style</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row>
                          <v-col cols="12">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-switch
                                  v-bind="attrs"
                                  v-on="on"
                                  label="Show pointer"
                                  v-model="settings.pointer.show"
                                  @change="updated"
                                />
                              </template>
                              <span>Whether to show the pointer of gauge chart</span>
                            </v-tooltip>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="settings.pointer.width"
                              type="number"
                              label="Width of pointer"
                              min="0"
                              max="200"
                              @input="updated"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <ItemStyle subscriber="pointerStyle" @pointerStyle="pointerStyle" />
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </template>
                <span>Settings about gauge pointer</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>Gauge Chart Title</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartLabel subscriber="gaugeTitleStyle" @gaugeTitleStyle="gaugeTitleStyle" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-header>Settings of gauge chart detail used to show data</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ChartLabel :default="settings.title" subscriber="gaugeDetailStyle" @gaugeDetailStyle="gaugeDetailStyle" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import ItemStyle from '../ItemStyle.vue'
import ChartLabel from '../ChartLabel.vue'
export default {
  data () {
    return {
      settings: {
        type: 'gauge',
        colorBy: 'data',
        radius: '75%',
        startAngle: 225,
        endAngle: -45,
        clockwise: true,
        min: 0,
        max: 100,
        splitNumber: 10,
        progress: {
          show: true,
          width: 10,
          itemStyle: {
            borderColor: '#000',
            color: '',
            borderWidth: 0,
            borderType: 'solid',
            shadowBlur: 0,
            shadowColor: '',
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        },
        pointer: {
          show: true,
          length: 100,
          itemStyle: {
            borderColor: '#000',
            color: '',
            borderWidth: 0,
            borderType: 'solid',
            shadowBlur: 0,
            shadowColor: '',
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        },
        title: {
          show: true
        },
        detail: {
          show: true
        },
        tooltip: {}
      },
      radius: 75,
      colorBy: ['data', 'series'],
      borderTypes: ['solid', 'dashed', 'dotted']
    }
  },
  created () {
    this.radius = this.settings.radius.replace('%', '')
  },
  components: {
    ItemStyle,
    ChartLabel
  },
  methods: {
    radiusChanged () {
      this.settings.radius = this.radius + '%'
    },
    progressStyle (setting) {
      for (const style in setting.value) {
        this.settings.progress.itemStyle[style] = setting.value[style]
      }
      this.updated()
    },
    pointerStyle (setting) {
      for (const style in setting.value) {
        this.settings.pointer.itemStyle[style] = setting.value[style]
      }
      this.updated()
    },
    gaugeTitleStyle (setting) {
      for (const style in setting.value) {
        this.settings.title[style] = setting.value[style]
      }
      this.updated()
    },
    gaugeDetailStyle (setting) {
      for (const style in setting.value) {
        this.settings.detail[style] = setting.value[style]
      }
      this.updated()
    },
    updated () {
      this.$emit('chartSettings', this.settings)
    }
  }
}
</script>
