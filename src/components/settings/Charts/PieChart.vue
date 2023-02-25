<template>
  <v-container grid-list-xs>
    <v-row>
      <v-col cols="6">
        <v-text-field
          type="number"
          min="0"
          max="100"
          v-model="innerRadius"
          label="Inner Radius"
          @input="radius('inner')"
          append-icon="mdi-percent"
        >
          <v-tooltip activator="parent" location="bottom"
            >Inner Radius of Pie chart</v-tooltip
          >
        </v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          type="number"
          min="0"
          max="100"
          v-model="outerRadius"
          label="Outer Radius"
          @input="radius('outer')"
          append-icon="mdi-percent"
        >
          <v-tooltip activator="parent" location="bottom"
            >Outer Radius of Pie chart</v-tooltip
          >
        </v-text-field>
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
    <v-text-field
      v-model="settings.selectedOffset"
      type="number"
      label="Offset Of Selected Sector"
      min="-200"
      max="200"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The offset distance of selected sector.</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.startAngle"
      type="number"
      label="Start angle, ragenges [0, 360]"
      min="0"
      max="360"
      @input="updated"
    ></v-text-field>
    <v-text-field
      v-model="settings.minAngle"
      type="number"
      label="Minimum Angle of Sector"
      min="0"
      max="360"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The minimum angle of sector (0 ~ 360). It prevents some sector from
        being too small when value is small, which will affect user
        interaction</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.minShowLabelAngle"
      type="number"
      label="Minimum Angle To Show Label"
      min="0"
      max="360"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >If a sector is less than this angle (0 ~ 360), label and labelLine will
        not be displayed</v-tooltip
      >
    </v-text-field>
    <v-select
      :items="roseTypes"
      v-model="settings.roseType"
      label="Rose Type"
      @change="updated"
      clearable
    >
      <v-tooltip activator="parent" location="bottom"
        >Whether to show as Nightingale chart, which distinguishes data through
        radius</v-tooltip
      >
    </v-select>
    <v-switch
      color="blue"
      label="Avoid Label Overlap"
      v-model="settings.avoidLabelOverlap"
      @change="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Whether to enable the strategy to avoid labels overlap. Defaults to be
        enabled, which will move the label positions in the case of labels
        overlapping</v-tooltip
      >
    </v-switch>
    <v-switch
      color="blue"
      label="Show Zero Sum"
      v-model="settings.stillShowZeroSum"
      @change="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Whether to show sector when all data are zero.</v-tooltip
      >
    </v-switch>
    <v-text-field
      v-model="settings.left"
      type="number"
      label="Move from left by"
      min="-1000"
      max="1000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Distance between pie chart component and the left side of the
        container</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.right"
      type="number"
      label="Move from right by"
      min="-1000"
      max="1000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Distance between pie chart component and the right side of the
        container</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.top"
      type="number"
      label="Move from top by"
      min="-1000"
      max="1000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Distance between pie chart component and the top side of the
        container</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.bottom"
      type="number"
      label="Move from bottom by"
      min="-1000"
      max="1000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Distance between pie chart component and the bottom side of the
        container</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.width"
      type="number"
      label="Width of pie component"
      min="-1000"
      max="1000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Width of pie chart component. Adaptive by default.</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.height"
      type="number"
      label="Height of pie component"
      min="-1000"
      max="1000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Height of pie chart component. Adaptive by default.e</v-tooltip
      >
    </v-text-field>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Labels</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12">
              <v-switch
                color="blue"
                label="Show/Hide"
                v-model="settings.label.show"
                @change="updated"
              >
                <v-tooltip activator="parent" location="bottom"
                  >Show or Hide labels</v-tooltip
                >
              </v-switch>
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
              <v-text-field
                v-model="settings.label.distanceToLabelLine"
                type="number"
                label="Distance between label line and text"
                min="0"
                max="100"
                @input="updated"
              >
                <v-tooltip activator="parent" location="bottom"
                  >Distance between label line and text</v-tooltip
                >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <TextStyle @textStyle="LabelTextStyle" :values="settings.label" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Settings about labels of a pie sectors</v-tooltip
      >
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Labels Lines</v-expansion-panel-title>
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
              <v-text-field
                v-model="settings.labelLine.length"
                type="number"
                label="Length of first segment"
                min="0"
                max="100"
                @input="updated"
              >
                <v-tooltip activator="parent" location="bottom"
                  >The length of the first segment of guide line</v-tooltip
                >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="settings.labelLine.length2"
                type="number"
                label="Length of second segment"
                min="0"
                max="100"
                @input="updated"
              >
                <v-tooltip activator="parent" location="bottom"
                  >The length of the second segment of guide line</v-tooltip
                >
              </v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Settings about lines of labels</v-tooltip
      >
    </v-expansion-panels>
  </v-container>
</template>
<script>
import TextStyle from "../TextStyle.vue";
export default {
  props: { chartSubType: String, options: Object },
  data() {
    return {
      settings: {
        type: "pie",
        colorBy: "data",
        selectedMode: "single",
        selectedOffset: 20,
        startAngle: 90,
        minAngle: "",
        minShowLabelAngle: "",
        roseType: "",
        avoidLabelOverlap: true,
        stillShowZeroSum: true,
        left: "",
        right: "",
        top: "",
        bottom: "",
        width: "",
        height: "",
        label: {
          show: true,
          position: "outside",
          distanceToLabelLine: 5,
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 15,
        },
        labelLayout: {
          draggable: true,
        },
        itemStyle: {},
        radius: ["0%", "75%"],
        tooltip: {
          trigger: "item",
        },
      },
      colorBy: ["data", "series"],
      selectedMode: [false, "single", "multiple", "series"],
      roseTypes: ["radius", "area"],
      labelPosition: ["outside", "inside", "inner", "center"],
      innerRadius: 0,
      outerRadius: 75,
    };
  },
  watch: {
    chartSubType() {
      if (this.chartSubType === "donut") {
        this.settings.radius = ["40%", "70%"];
        this.settings.avoidLabelOverlap = false;
        this.settings.label = {
          show: false,
          position: "center",
        };
        this.settings.emphasis = {
          label: {
            show: true,
            fontSize: "12",
            fontWeight: "bold",
          },
        };
        this.settings.labelLine.show = false;
        this.settings.itemStyle = {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        };
      } else {
        this.settings.radius = ["0%", "70%"];
        this.settings.avoidLabelOverlap = true;
        this.settings.label = {
          show: true,
          position: "outside",
          distanceToLabelLine: 5,
        };
        delete this.settings.emphasis;
        this.settings.labelLine.show = true;
        this.settings.itemStyle = {};
      }
    },
  },
  created() {
    if (this.chartSubType === "donut") {
      this.settings.radius = ["40%", "70%"];
      this.settings.avoidLabelOverlap = false;
      this.settings.label = {
        show: false,
        position: "center",
      };
      this.settings.emphasis = {
        label: {
          show: true,
          fontSize: "12",
          fontWeight: "bold",
        },
      };
      this.settings.labelLine = {
        show: false,
      };
      this.settings.itemStyle = {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      };
    }
    if (this.options.series && this.options.series.length > 0) {
      const pieOpts = this.options.series.find((ser) => {
        return ser.type === "pie";
      });
      for (const index in pieOpts) {
        if (this.settings[index]) {
          this.settings[index] = pieOpts[index];
        }
      }
    }
    this.innerRadius = this.settings.radius[0].replace("%", "");
    this.outerRadius = this.settings.radius[1].replace("%", "");
    this.updated();
  },
  methods: {
    LabelTextStyle(setting) {
      for (const style in setting.value) {
        this.settings.label[style] = setting.value[style];
      }
      this.updated();
    },
    updated() {
      this.$emit("chartSettings", this.settings);
    },
    radius(type) {
      if (type === "inner") {
        if (this.innerRadius > 100) {
          this.innerRadius = 100;
        }
        if (this.innerRadius < 0) {
          this.innerRadius = 0;
        }
        this.settings.radius = [this.innerRadius + "%", this.outerRadius + "%"];
      }
      if (type === "outer") {
        if (this.outerRadius > 100) {
          this.outerRadius = 100;
        }
        if (this.outerRadius < 0) {
          this.outerRadius = 0;
        }
        this.settings.radius = [this.innerRadius + "%", this.outerRadius + "%"];
      }
      this.updated();
    },
  },
  components: {
    TextStyle,
  },
};
</script>
