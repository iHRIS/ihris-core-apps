<template>
  <v-container grid-list-xs>
    <v-dialog v-model="displayAreaColor" width="313px">
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="settings.areaStyle.color"
      ></v-color-picker>
    </v-dialog>
    <v-select
      :items="colorBy"
      v-model="settings.colorBy"
      label="Color By"
      @change="updated"
    ></v-select>
    <v-switch
      color="blue"
      label="Mark point in a chart"
      v-model="markPoint"
      @change="markPointSwitch"
    >
      <v-tooltip activator="parent" location="bottom"
        >Display a mark for the highest/minimum value on the line</v-tooltip
      >
    </v-switch>
    <v-select
      :items="symbol"
      v-model="settings.symbol"
      label="Symbol"
      item-title="display"
      item-value="name"
      @change="updated"
    ></v-select>
    <v-text-field
      v-model="settings.symbolSize"
      type="number"
      label="Symbol size"
      min="0"
      max="100"
      @input="updated"
    ></v-text-field>
    <v-select
      :items="steps"
      v-model="settings.step"
      label="Step line"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Whether to show as a step line</v-tooltip
      >
    </v-select>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Labels</v-expansion-panel-title>
        <v-expansion-panel-text>
          <ChartLabel
            subscriber="lineLabel"
            @lineLabel="lineLabelSettings"
            :values="settings.label"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Settings about labels of a bar</v-tooltip
      >
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>End Label</v-expansion-panel-title>
        <v-expansion-panel-text>
          <ChartLabel
            subscriber="lineEndLabel"
            @lineEndLabel="lineEndLabelSettings"
            :values="settings.endLabel"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Label on the end of line</v-tooltip
      >
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Label Line</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12">
              <v-switch
                color="blue"
                label="Show/Hide"
                v-model="settings.labelLine.show"
                @change="updated"
              >
                <v-tooltip activator="parent" location="bottom"
                  >Show or Hide label line</v-tooltip
                >
              </v-switch>
            </v-col>
            <v-col cols="12">
              <LineStyle
                subscriber="labelLineStyle"
                @labelLineStyle="labelLineStyle"
                :values="settings.labelLine.lineStyle"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Configuration of label guide line</v-tooltip
      >
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Line Style</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col>
              <v-select
                :items="lineType"
                v-model="settings.lineStyle.type"
                label="Type"
                @input="updated"
              ></v-select>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Area Style</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6"> Color: </v-col>
            <v-col cols="6">
              <v-card
                :color="settings.areaStyle.color"
                width="30px"
                height="20"
                @click="displayAreaColor = true"
              >
                <v-card-text @click="displayAreaColor = true"> </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Configuration of label guide line</v-tooltip
      >
    </v-expansion-panels>
  </v-container>
</template>
<script>
import LineStyle from "../LineStyle.vue";
import ChartLabel from "../ChartLabel.vue";
export default {
  props: { chartSubType: String, option: Object },
  data() {
    return {
      settings: {
        type: "line",
        colorBy: "data",
        label: {},
        endLabel: {},
        labelLine: {
          show: false,
          lineStyle: {},
        },
        lineStyle: {
          type: "solid",
        },
        areaStyle: {
          color: "#BEB9B90A",
        },
        markPoint: {},
        symbol: "emptyCircle",
        symbolSize: 4,
        step: false,
      },
      markPoint: false,
      displayAreaColor: false,
      lineType: ["solid", "dashed", "dotted"],
      steps: [false, true, "start", "middle", "end"],
      colorBy: ["data", "series"],
      symbol: [
        {
          name: "emptyCircle",
          display: "Empty Circle",
        },
        {
          name: "circle",
          display: "Circle",
        },
        {
          name: "rect",
          display: "Rectangle",
        },
        {
          name: "roundRect",
          display: "Round Rectangle",
        },
        {
          name: "triangle",
          display: "Triangle",
        },
        {
          name: "diamond",
          display: "Diamond",
        },
        {
          name: "pin",
          display: "Pin",
        },
        {
          name: "arrow",
          display: "Arrow",
        },
        {
          name: "none",
          display: "None",
        },
      ],
    };
  },
  watch: {
    chartSubType() {
      if (this.chartSubType === "area") {
        this.settings.areaStyle = {};
      } else {
        delete this.settings.areaStyle;
      }
    },
  },
  created() {
    if (this.chartSubType === "area") {
      this.settings.areaStyle = {};
    }
    if (this.option.series && this.option.series.length > 0) {
      const lineOpts = this.option.series.find((ser) => {
        return ser.type === "line";
      });
      for (const index in lineOpts) {
        if (this.settings[index]) {
          this.settings[index] = lineOpts[index];
        }
      }
    }
    if (this.settings.markPoint && this.settings.markPoint.data) {
      this.markPoint = true;
    }
    this.updated();
  },
  methods: {
    markPointSwitch() {
      if (this.markPoint) {
        this.settings.markPoint = {
          data: [
            {
              type: "max",
            },
          ],
          symbol: "pin",
        };
      } else {
        this.settings.markPoint = {};
      }
      this.updated();
    },
    lineLabelSettings(setting) {
      this.settings.label = setting;
      this.updated();
    },
    lineEndLabelSettings(setting) {
      this.settings.endLabel = setting;
      this.updated();
    },
    labelLineStyle(setting) {
      for (const style in setting.value) {
        this.settings.labelLine.lineStyle[style] = setting.value[style];
      }
      this.updated();
    },
    updated() {
      this.$emit("chartSettings", this.settings);
    },
  },
  components: {
    LineStyle,
    ChartLabel,
  },
};
</script>
