<template>
  <div>
    <v-dialog v-model="displayLineStyleColor" width="313px">
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="axis.axisLine.lineStyle.color"
      ></v-color-picker>
    </v-dialog>
    <v-dialog v-model="displayAxisTickColor" width="313px">
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="axis.axisTick.lineStyle.color"
      ></v-color-picker>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-switch
          color="blue"
          label="Show/Hide"
          v-model="axis.show"
          @change="updated"
        ></v-switch>
        <v-select
          :items="position"
          v-model="axis.position"
          label="Position of x axis"
          @change="updated"
        ></v-select>
        <v-text-field
          v-model="axis.offset"
          type="number"
          label="Offset of x axis relative to default position"
          min="-400"
          max="400"
          @input="updated"
        ></v-text-field>
        <v-select
          :items="types"
          v-model="axis.type"
          label="Type of axis"
          item-title="name"
          item-value="value"
          @change="updated"
        ></v-select>
        <v-text-field
          v-model="axis.name"
          label="Name of axis"
          @input="updated"
        ></v-text-field>
        <v-select
          :items="nameLocation"
          v-model="axis.nameLocation"
          label="Name position"
          @change="updated"
        ></v-select>
        <v-text-field
          v-model="axis.nameGap"
          type="number"
          label="Gap between axis name and axis line"
          min="-400"
          max="400"
          @input="updated"
        ></v-text-field>
        <v-text-field
          v-model="axis.nameRotate"
          type="number"
          label="Rotation of axis name"
          min="-400"
          max="400"
          @input="updated"
        ></v-text-field>
        <v-expansion-panels multiple focusable>
          <v-expansion-panel>
            <v-expansion-panel-title
              >Text Style of axis name</v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <TextStyle @textStyle="textStyle" :values="axis.nameTextStyle" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-switch
          color="blue"
          label="Invert the axis"
          v-model="axis.inverse"
          @change="updated"
        ></v-switch>
        <v-text-field
          v-model="axis.min"
          type="number"
          label="The minimun value of axis"
          @input="updated"
        ></v-text-field>
        <v-text-field
          v-model="axis.max"
          type="number"
          label="The maximum value of axis"
          @input="updated"
        ></v-text-field>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>Axis Label</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Show/Hide"
                    v-model="axis.axisLabel.show"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Axis labels face the inside direction"
                    v-model="axis.axisLabel.inside"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="axis.axisLabel.interval"
                    type="number"
                    label="Interval of Axis label"
                    min="0"
                    max="400"
                    @input="updated"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="axis.axisLabel.rotate"
                    type="number"
                    label="Rotate Axis label"
                    min="-90"
                    max="90"
                    @input="updated"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="axis.axisLabel.margin"
                    type="number"
                    label="Margin between axis label and axis line"
                    min="-90"
                    max="90"
                    @input="updated"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Show the label of the min tick"
                    v-model="axis.axisLabel.showMinLabel"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Show the label of the max tick"
                    v-model="axis.axisLabel.showMaxLabel"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Hide overlapped labels"
                    v-model="axis.axisLabel.hideOverlap"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <TextStyle
                    @textStyle="axisLabelStyle"
                    :values="axis.axisLabel"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>Axis Line</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Show/Hide"
                    v-model="axis.axisLine.show"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-title
                        >Line Style</v-expansion-panel-title
                      >
                      <v-expansion-panel-text>
                        <LineStyle
                          subscriber="axisLineStyle"
                          @axisLineStyle="axisLineStyle"
                          :values="axis.axisLine"
                        />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title
              >Split line of axis in grid area</v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Show/Hide"
                    v-model="axis.splitLine.show"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="axis.splitLine.interval"
                    type="number"
                    label="Interval of Axis split lines"
                    min="0"
                    max="400"
                    @input="updated"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-title
                        >Line Style</v-expansion-panel-title
                      >
                      <v-expansion-panel-text>
                        <LineStyle
                          subscriber="splitLineStyle"
                          @splitLineStyle="splitLineStyle"
                          :values="axis.splitLine"
                        />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>Axis Tick</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Show/Hide"
                    v-model="axis.axisTick.show"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Align axis tick with label"
                    v-model="axis.axisTick.alignWithLabel"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-switch
                    color="blue"
                    label="Axis labels face the inside direction"
                    v-model="axis.axisTick.inside"
                    @change="updated"
                  ></v-switch>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="axis.axisTick.length"
                    type="number"
                    label="Length of the axis tick"
                    min="0"
                    max="400"
                    @input="updated"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-title
                        >Line Style</v-expansion-panel-title
                      >
                      <v-expansion-panel-text>
                        <LineStyle
                          subscriber="axisTickStyle"
                          @axisTickStyle="axisTickStyle"
                          :values="axis.axisTick"
                        />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels multiple focusable>
          <v-expansion-panel>
            <v-expansion-panel-title
              >Chart Axis Pointer</v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <ChartAxisPointer
                @chartAxisPointer="externalSettings"
                :values="axis.axisPointer"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import TextStyle from "./TextStyle.vue";
import LineStyle from "./LineStyle.vue";
import ChartAxisPointer from "./ChartAxisPointer.vue";
export default {
  props: ["values"],
  data() {
    return {
      displayLineStyleColor: false,
      displayAxisTickColor: false,
      axis: {
        show: true,
        position: "bottom",
        offset: 0,
        type: "category",
        name: "",
        nameLocation: "end",
        nameGap: 15,
        nameRotate: 0,
        nameTextStyle: {},
        inverse: false,
        min: "dataMin",
        max: "dataMax",
        axisLine: {
          show: true,
          onZero: true,
          lineStyle: {
            color: "#333",
            width: 1,
            type: "solid",
            cap: "butt",
            opacity: 1,
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: false,
          inside: false,
          length: 5,
          lineStyle: {
            color: "#333",
            width: 1,
            type: "solid",
            cap: "butt",
            opacity: 1,
          },
        },
        axisLabel: {
          show: true,
          inside: false,
          interval: "auto",
          rotate: 0,
          margin: 8,
          showMinLabel: true,
          showMaxLabel: true,
          hideOverlap: false,
          lineStyle: {
            color: "#333",
            width: 1,
            type: "solid",
            cap: "butt",
            opacity: 1,
          },
        },
        splitLine: {
          show: false,
          interval: 0,
          lineStyle: {
            color: "#333",
            width: 1,
            type: "solid",
            cap: "butt",
            opacity: 1,
          },
        },
        axisPointer: {
          show: false,
          type: "line",
          label: {
            show: false,
            margin: 3,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal",
            fontFamily: "sans-serif",
            lineHeight: 12,
          },
          triggerTooltip: true,
          value: "",
          handle: {
            show: true,
            size: 45,
            color: "#333",
          },
        },
      },
      position: ["bottom", "top"],
      types: [
        {
          name: "Numerical axis, suitable for continuous data",
          value: "value",
        },
        {
          name: "Category axis, suitable for discrete category data",
          value: "category",
        },
        {
          name: "Time axis, suitable for continuous time series data",
          value: "time",
        },
        {
          name: "Log axis, suitable for log data",
          value: "log",
        },
      ],
      nameLocation: ["start", "middle", "end"],
    };
  },
  methods: {
    externalSettings(setting) {
      this.axis[setting.name] = setting.value;
      this.updated();
    },
    textStyle(setting) {
      for (const style in setting.value) {
        this.axis.nameTextStyle[style] = setting.value[style];
      }
      this.updated();
    },
    axisLineStyle(setting) {
      for (const style in setting.value) {
        this.axis.axisLine.lineStyle[style] = setting.value[style];
      }
      this.updated();
    },
    axisTickStyle(setting) {
      for (const style in setting.value) {
        this.axis.axisTick.lineStyle[style] = setting.value[style];
      }
      this.updated();
    },
    splitLineStyle(setting) {
      for (const style in setting.value) {
        this.axis.splitLine.lineStyle[style] = setting.value[style];
      }
      this.updated();
    },
    axisLabelStyle(setting) {
      for (const style in setting.value) {
        this.axis.axisLabel[style] = setting.value[style];
      }
      this.updated();
    },
    updated() {
      this.$emit("chartAxis", { name: "axis", value: this.axis });
    },
  },
  created() {
    for (const index in this.values) {
      if (Object.keys(this.axis).indexOf(index) !== -1) {
        this.axis[index] = this.values[index];
      }
    }
    if (!this.values || this.values.length === 0) {
      this.updated();
    }
  },
  components: {
    TextStyle,
    LineStyle,
    ChartAxisPointer,
  },
};
</script>
