<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              type="number"
              min="0"
              max="100"
              v-model="innerRadius"
              label="Inner Radius"
              @input="radius('inner')"
              append-icon="mdi-percent"
            ></v-text-field>
          </template>
          <span>Inner Radius of Pie chart</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              type="number"
              min="0"
              max="100"
              v-model="outerRadius"
              label="Outer Radius"
              @input="radius('outer')"
              append-icon="mdi-percent"
            ></v-text-field>
          </template>
          <span>Outer Radius of Pie chart</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-select
      :items="colorBy"
      v-model="settings.colorBy"
      label="Color By"
      @change="updated"
    ></v-select>
    <v-select
      :items="selectedMode"
      v-model="settings.selectedMode"
      label="Sector Selection Mode"
      @change="updated"
    ></v-select>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.selectedOffset"
          type="number"
          label="Offset Of Selected Sector"
          min="-200"
          max="200"
          @input="updated"
        ></v-text-field>
      </template>
      <span>The offset distance of selected sector.</span>
    </v-tooltip>
    <v-text-field
      v-model="settings.startAngle"
      type="number"
      label="Start angle, ragenges [0, 360]"
      min="0"
      max="360"
      @input="updated"
    ></v-text-field>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.minAngle"
          type="number"
          label="Minimum Angle of Sector"
          min="0"
          max="360"
          @input="updated"
        ></v-text-field>
      </template>
      <span>The minimum angle of sector (0 ~ 360). It prevents some sector from being too small when value is small, which will affect user interaction</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.minShowLabelAngle"
          type="number"
          label="Minimum Angle To Show Label"
          min="0"
          max="360"
          @input="updated"
        ></v-text-field>
      </template>
      <span>If a sector is less than this angle (0 ~ 360), label and labelLine will not be displayed</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-select
          v-bind="attrs"
          v-on="on"
          :items="roseTypes"
          v-model="settings.roseType"
          label="Rose Type"
          @change="updated"
          clearable
        ></v-select>
      </template>
      <span>Whether to show as Nightingale chart, which distinguishes data through radius</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-switch
          v-bind="attrs"
          v-on="on"
          label="Avoid Label Overlap"
          v-model="settings.avoidLabelOverlap"
          @change="updated"
        />
      </template>
      <span>Whether to enable the strategy to avoid labels overlap. Defaults to be enabled, which will move the label positions in the case of labels overlapping</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-switch
          v-bind="attrs"
          v-on="on"
          label="Show Zero Sum"
          v-model="settings.stillShowZeroSum"
          @change="updated"
        />
      </template>
      <span>Whether to show sector when all data are zero.</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.left"
          type="number"
          label="Move from left by"
          min="-1000"
          max="1000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>Distance between pie chart component and the left side of the container</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.right"
          type="number"
          label="Move from right by"
          min="-1000"
          max="1000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>Distance between pie chart component and the right side of the container</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.top"
          type="number"
          label="Move from top by"
          min="-1000"
          max="1000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>Distance between pie chart component and the top side of the container</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.bottom"
          type="number"
          label="Move from bottom by"
          min="-1000"
          max="1000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>Distance between pie chart component and the bottom side of the container</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.width"
          type="number"
          label="Width of pie component"
          min="-1000"
          max="1000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>Width of pie chart component. Adaptive by default.</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-bind="attrs"
          v-on="on"
          v-model="settings.height"
          type="number"
          label="Height of pie component"
          min="-1000"
          max="1000"
          @input="updated"
        ></v-text-field>
      </template>
      <span>Height of pie chart component. Adaptive by default.</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-expansion-panels multiple focusable v-bind="attrs" v-on="on">
          <v-expansion-panel>
            <v-expansion-panel-header>Labels</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-switch
                        v-bind="attrs"
                        v-on="on"
                        label="Show/Hide"
                        v-model="settings.label.show"
                        @change="updated"
                      />
                    </template>
                    <span>Show or Hide labels</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12">
                  <v-select
                    :items="labelPosition"
                    v-model="settings.label.position"
                    label="Position of label"
                    @change="updated"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-bind="attrs"
                        v-on="on"
                        v-model="settings.label.distanceToLabelLine"
                        type="number"
                        label="Distance between label line and text"
                        min="0"
                        max="100"
                        @input="updated"
                      ></v-text-field>
                    </template>
                    <span>Distance between label line and text</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12">
                  <TextStyle @textStyle='LabelTextStyle' />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <span>Settings about labels of a pie sectors</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-expansion-panels multiple focusable v-bind="attrs" v-on="on">
          <v-expansion-panel>
            <v-expansion-panel-header>Labels Lines</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-switch
                        v-bind="attrs"
                        v-on="on"
                        label="Show/Hide"
                        v-model="settings.labelLine.show"
                        @change="updated"
                      />
                    </template>
                    <span>Show or Hide label line</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-bind="attrs"
                        v-on="on"
                        v-model="settings.labelLine.length"
                        type="number"
                        label="Length of first segment"
                        min="0"
                        max="100"
                        @input="updated"
                      ></v-text-field>
                    </template>
                    <span>The length of the first segment of guide line</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-bind="attrs"
                        v-on="on"
                        v-model="settings.labelLine.length2"
                        type="number"
                        label="Length of second segment"
                        min="0"
                        max="100"
                        @input="updated"
                      ></v-text-field>
                    </template>
                    <span>The length of the second segment of guide line</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <span>Settings about lines of labels</span>
    </v-tooltip>
  </v-container>
</template>
<script>
import TextStyle from '../TextStyle.vue'
export default {
  props: { externalSettings: Object, chartSubType: String },
  data () {
    return {
      settings: {
        type: 'pie',
        colorBy: 'data',
        selectedMode: 'single',
        selectedOffset: 20,
        startAngle: 90,
        minAngle: '',
        minShowLabelAngle: '',
        roseType: '',
        avoidLabelOverlap: true,
        stillShowZeroSum: true,
        left: '',
        right: '',
        top: '',
        bottom: '',
        width: '',
        height: '',
        label: {
          show: true,
          position: 'outside',
          distanceToLabelLine: 5
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 15
        },
        labelLayout: {
          draggable: true
        },
        itemStyle: {},
        radius: ['0%', '75%'],
        tooltip: {
          trigger: 'item'
        }
      },
      colorBy: ['data', 'series'],
      selectedMode: [false, 'single', 'multiple', 'series'],
      roseTypes: ['radius', 'area'],
      labelPosition: ['outside', 'inside', 'inner', 'center'],
      innerRadius: 0,
      outerRadius: 75
    }
  },
  watch: {
    chartSubType () {
      if (this.chartSubType === 'donut') {
        this.settings.radius = ['40%', '70%']
        this.settings.avoidLabelOverlap = false
        this.settings.label = {
          show: false,
          position: 'center'
        }
        this.settings.emphasis = {
          label: {
            show: true,
            fontSize: '12',
            fontWeight: 'bold'
          }
        }
        this.settings.labelLine.show = false
        this.settings.itemStyle = {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        }
      } else {
        this.settings.radius = ['0%', '70%']
        this.settings.avoidLabelOverlap = true
        this.settings.label = {
          show: true,
          position: 'outside',
          distanceToLabelLine: 5
        }
        delete this.settings.emphasis
        this.settings.labelLine.show = true
        this.settings.itemStyle = {}
      }
    }
  },
  created () {
    if (this.chartSubType === 'donut') {
      this.settings.radius = ['40%', '70%']
      this.settings.avoidLabelOverlap = false
      this.settings.label = {
        show: false,
        position: 'center'
      }
      this.settings.emphasis = {
        label: {
          show: true,
          fontSize: '12',
          fontWeight: 'bold'
        }
      }
      this.settings.labelLine = {
        show: false
      }
      this.settings.itemStyle = {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      }
    }
    this.innerRadius = this.settings.radius[0].replace('%', '')
    this.outerRadius = this.settings.radius[1].replace('%', '')
    this.updated()
  },
  methods: {
    LabelTextStyle (setting) {
      for (const style in setting.value) {
        this.settings.label[style] = setting.value[style]
      }
      this.updated()
    },
    updated () {
      this.$emit('chartSettings', this.settings)
    },
    radius (type) {
      if (type === 'inner') {
        if (this.innerRadius > 100) {
          this.innerRadius = 100
        }
        if (this.innerRadius < 0) {
          this.innerRadius = 0
        }
        this.settings.radius = [this.innerRadius + '%', this.outerRadius + '%']
      }
      if (type === 'outer') {
        if (this.outerRadius > 100) {
          this.outerRadius = 100
        }
        if (this.outerRadius < 0) {
          this.outerRadius = 0
        }
        this.settings.radius = [this.innerRadius + '%', this.outerRadius + '%']
      }
      this.updated()
    }
  },
  components: {
    TextStyle
  }
}
</script>
