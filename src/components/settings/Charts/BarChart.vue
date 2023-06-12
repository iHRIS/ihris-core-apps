<template>
  <v-container grid-list-xs>
    <v-dialog v-model="displayBColor" width="313px">
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="settings.backgroundStyle.color"
      ></v-color-picker>
    </v-dialog>
    <v-dialog v-model="displayBBorderColor" width="313px">
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="settings.backgroundStyle.borderColor"
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
    <v-switch
      color="blue"
      label="Show background"
      v-model="settings.showBackground"
      @change="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Whether to show background behind each bar. Use backgroundStyle to set
        background style</v-tooltip
      >
    </v-switch>
    <v-expansion-panels
      multiple
      focusable
      v-model="expandBackgroundStyleSettings"
    >
      <v-expansion-panel>
        <v-expansion-panel-title>Bar Background Style</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="6"> Color: </v-col>
            <v-col cols="6">
              <v-card
                :color="settings.backgroundStyle.color"
                width="30px"
                height="20"
                @click="displayBColor = true"
              >
                <v-card-text @click="displayBColor = true"> </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6"> Color: </v-col>
            <v-col cols="6">
              <v-card
                :color="settings.backgroundStyle.borderColor"
                width="30px"
                height="20"
                @click="displayBBorderColor = true"
              >
                <v-card-text @click="displayBBorderColor = true"> </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="settings.backgroundStyle.borderWidth"
                type="number"
                label="Border width"
                min="0"
                max="40"
                @input="updated"
              >
                <v-tooltip activator="parent" location="bottom"
                  >The border width of bar. defaults to have no
                  border</v-tooltip
                >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="borderTypes"
                v-model="settings.backgroundStyle.borderType"
                label="Border type"
                @input="updated"
              ></v-select>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels multiple focusable v-model="expandLabelSettings">
      <v-expansion-panel>
        <v-expansion-panel-title>Labels</v-expansion-panel-title>
        <v-expansion-panel-text>
          <ChartLabel
            subscriber="barLabel"
            @barLabel="barLabelSettings"
            :values="settings.label"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Settings about labels of a bar</v-tooltip
      >
    </v-expansion-panels>
    <v-expansion-panels multiple focusable v-model="expandLabelLineSettings">
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
    <v-expansion-panels multiple focusable v-model="expandBarsSettings">
      <v-expansion-panel>
        <v-expansion-panel-title>Bars Settings</v-expansion-panel-title>
        <v-expansion-panel-text>
          <ItemStyle
            subscriber="barStyle"
            @barStyle="barStyle"
            :values="settings.itemStyle"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-text-field
      v-model="settings.barWidth"
      type="number"
      label="Bar width"
      min="0"
      max="100"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The width of the bar. Adaptive when not specified</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.barMaxWidth"
      type="number"
      label="Bar maximum width"
      min="0"
      max="100"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The maximum width of the bar. Has higer priority than
        barWidth</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.barMinWidth"
      type="number"
      label="Bar minimum width"
      min="0"
      max="100"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The minimum width of the bar. Has higer priority than
        barWidth</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="barGap"
      type="number"
      label="Gap between bars"
      min="-100"
      max="100"
      @input="barGapUpdated"
      append-icon="mdi-percent"
    ></v-text-field>
  </v-container>
</template>
<script>
import LineStyle from "../LineStyle.vue";
import ChartLabel from "../ChartLabel.vue";
import ItemStyle from "../ItemStyle.vue";
export default {
  emits: ["chartSettings"],
  props: { option: Object },
  data() {
    return {
      expandLabelSettings: [],
      expandBackgroundStyleSettings: [],
      expandLabelLineSettings: [],
      expandBarsSettings: [],
      settings: {
        type: "bar",
        barWidth: "",
        barMaxWidth: "",
        barMinWidth: "",
        barGap: "30%",
        colorBy: "data",
        showBackground: false,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
          borderColor: "#000",
          borderWidth: 0,
          borderType: "solid",
        },
        label: {
          show: false,
          rotate: 0,
          offset: [0, 0],
        },
        labelLine: {
          show: false,
          lineStyle: {},
        },
        itemStyle: {
          color: "auto",
          borderColor: "#000",
          borderWidth: 0,
          borderType: "solid",
          shadowBlur: 0,
          shadowColor: "",
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
        labelLayout: {
          draggable: true,
        },
        tooltip: {},
        markPoint: {},
      },
      displayBColor: false,
      displayBBorderColor: false,
      displayISBorderColor: false,
      displayISShadowColor: false,
      colorBy: ["data", "series"],
      borderTypes: ["solid", "dashed", "dotted"],
      position: [
        "top",
        "left",
        "right",
        "bottom",
        "inside",
        "insideLeft",
        "insideRight",
        "insideTop",
        "insideBottom",
        "insideTopLeft",
        "insideBottomLeft",
        "insideTopRight",
        "insideBottomRight",
        "start",
        "middle",
        "end",
        "insideStart",
        "insideEnd",
      ],
      barGap: "",
      markPoint: false,
    };
  },
  mounted() {
    this.expandLabelSettings.push(0);
    this.expandBackgroundStyleSettings.push(0);
    this.expandLabelLineSettings.push(0);
    this.expandBarsSettings.push(0);
    setTimeout(() => {
      this.expandLabelSettings = [];
      this.expandBackgroundStyleSettings = [];
      this.expandLabelLineSettings = [];
      this.expandBarsSettings = [];
    }, 500);
  },
  created() {
    if (this.option.series && this.option.series.length > 0) {
      const barOpts = this.option.series.find((ser) => {
        return ser.type === "bar";
      });
      for (const index in barOpts) {
        if (this.settings[index]) {
          this.settings[index] = barOpts[index];
        }
      }
    }

    this.updated();
    if (this.settings.barGap) {
      this.barGap = this.settings.barGap.replace("%", "");
    }
    if (this.settings.markPoint && this.settings.markPoint.data) {
      this.markPoint = true;
    }
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
    barGapUpdated() {
      this.settings.barGap = this.barGap + "%";
    },
    barLabelSettings(setting) {
      this.settings.label = setting;
      this.updated();
    },
    labelLineStyle(setting) {
      for (const style in setting.value) {
        this.settings.labelLine.lineStyle[style] = setting.value[style];
      }
      this.updated();
    },
    barStyle(setting) {
      for (const style in setting.value) {
        this.settings.itemStyle[style] = setting.value[style];
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
    ItemStyle,
  },
};
</script>
