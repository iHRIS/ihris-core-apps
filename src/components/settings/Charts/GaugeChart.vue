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
    <v-text-field
      v-model="settings.startAngle"
      type="number"
      label="Start angle of gauge chart"
      min="-360"
      max="360"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The direct right side of circle center is 0 degree, the right above it
        is 90 degree, the direct left side of it is 180 degree</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.endAngle"
      type="number"
      label="End angle of gauge chart"
      min="-360"
      max="360"
      @input="updated"
    ></v-text-field>
    <v-switch
      color="blue"
      label="Clockwise"
      v-model="settings.clockwise"
      @change="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >Whether the scale in gauge chart increases clockwise</v-tooltip
      >
    </v-switch>
    <v-text-field
      v-model="settings.min"
      type="number"
      label="Minimum value"
      min="-10000"
      max="10000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The minimum data value</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.max"
      type="number"
      label="Maximum value"
      min="-10000"
      max="10000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The maximum data value</v-tooltip
      >
    </v-text-field>
    <v-text-field
      v-model="settings.splitNumber"
      type="number"
      label="Split number"
      min="1"
      max="10000"
      @input="updated"
    >
      <v-tooltip activator="parent" location="bottom"
        >The number of split segments of gauge chart scale</v-tooltip
      >
    </v-text-field>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Progress</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12">
              <v-switch
                color="blue"
                label="Show progress"
                v-model="settings.progress.show"
                @change="updated"
              >
                <v-tooltip activator="parent" location="bottom"
                  >Whether to show the progress of gauge chart</v-tooltip
                >
              </v-switch>
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
              <v-expansion-panels multiple focusable>
                <v-expansion-panel>
                  <v-expansion-panel-title
                    >Pointer Style</v-expansion-panel-title
                  >
                  <v-expansion-panel-text>
                    <v-row>
                      <v-col cols="12">
                        <v-switch
                          color="blue"
                          label="Show pointer"
                          v-model="settings.pointer.show"
                          @change="updated"
                        >
                          <v-tooltip activator="parent" location="bottom"
                            >Whether to show the pointer of gauge
                            chart</v-tooltip
                          >
                        </v-switch>
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
                        <ItemStyle
                          subscriber="pointerStyle"
                          @pointerStyle="pointerStyle"
                          :values="settings.pointer.itemStyle"
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
                <v-tooltip activator="parent" location="bottom"
                  >Settings about gauge pointer</v-tooltip
                >
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Gauge Chart Title</v-expansion-panel-title>
        <v-expansion-panel-text>
          <ChartLabel
            subscriber="gaugeTitleStyle"
            @gaugeTitleStyle="gaugeTitleStyle"
            :values="settings.title"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title
          >Settings of gauge chart detail used to show
          data</v-expansion-panel-title
        >
        <v-expansion-panel-text>
          <ChartLabel
            :default="settings.title"
            subscriber="gaugeDetailStyle"
            @gaugeDetailStyle="gaugeDetailStyle"
            :values="settings.detail"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import ItemStyle from "../ItemStyle.vue";
import ChartLabel from "../ChartLabel.vue";
export default {
  props: { options: Object },
  data() {
    return {
      settings: {
        type: "gauge",
        colorBy: "data",
        radius: "75%",
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
            borderColor: "#000",
            color: "",
            borderWidth: 0,
            borderType: "solid",
            shadowBlur: 0,
            shadowColor: "",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        },
        pointer: {
          show: true,
          length: 100,
          itemStyle: {
            borderColor: "#000",
            color: "",
            borderWidth: 0,
            borderType: "solid",
            shadowBlur: 0,
            shadowColor: "",
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
        },
        title: {
          show: true,
        },
        detail: {
          show: true,
        },
        tooltip: {},
      },
      radius: 75,
      colorBy: ["data", "series"],
      borderTypes: ["solid", "dashed", "dotted"],
    };
  },
  created() {
    if (this.options.series && this.options.series.length > 0) {
      const gaugeOpts = this.options.series.find((ser) => {
        return ser.type === "gauge";
      });
      for (const index in gaugeOpts) {
        if (this.settings[index]) {
          this.settings[index] = gaugeOpts[index];
        }
      }
    }
    this.radius = this.settings.radius.replace("%", "");
  },
  components: {
    ItemStyle,
    ChartLabel,
  },
  methods: {
    radiusChanged() {
      this.settings.radius = this.radius + "%";
    },
    progressStyle(setting) {
      for (const style in setting.value) {
        this.settings.progress.itemStyle[style] = setting.value[style];
      }
      this.updated();
    },
    pointerStyle(setting) {
      for (const style in setting.value) {
        this.settings.pointer.itemStyle[style] = setting.value[style];
      }
      this.updated();
    },
    gaugeTitleStyle(setting) {
      for (const style in setting.value) {
        this.settings.title[style] = setting.value[style];
      }
      this.updated();
    },
    gaugeDetailStyle(setting) {
      for (const style in setting.value) {
        this.settings.detail[style] = setting.value[style];
      }
      this.updated();
    },
    updated() {
      this.$emit("chartSettings", this.settings);
    },
  },
};
</script>
