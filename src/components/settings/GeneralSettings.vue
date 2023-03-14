<template>
  <div>
    <v-expansion-panels multiple focusable v-model="expandSettings">
      <template v-for="(set, index) in settings">
        <v-expansion-panel
          :key="index"
          v-if="set.charts.indexOf(chartType) != -1"
        >
          <v-expansion-panel-title>{{ set.header }}</v-expansion-panel-title>
          <v-expansion-panel-text>
            <component
              :is="set.component"
              @[set.updateEvent]="externalSettings"
              v-bind="{ values: option[set.optionObject] }"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
export default {
  props: ["chartType", "chartSubType", "option"],
  data() {
    return {
      expandSettings: [],
      settings: [
        {
          header: "Chart Title",
          component: "ChartTitle",
          updateEvent: "chartTitle",
          optionObject: "title",
          charts: ["bar", "pie", "line", "gauge", "scatter"],
        },
        {
          header: "Chart Legend",
          component: "ChartLegend",
          updateEvent: "chartLegend",
          optionObject: "legend",
          charts: ["bar", "pie", "line", "gauge", "scatter"],
        },
        {
          header: "Chart Tooltip",
          component: "ChartToolTip",
          updateEvent: "chartTooltip",
          optionObject: "tooltip",
          charts: ["bar", "pie", "line", "gauge", "scatter"],
        },
        {
          header: "Chart Axis Pointer",
          component: "ChartAxisPointer",
          updateEvent: "chartAxisPointer",
          optionObject: "axisPointer",
          charts: ["bar", "pie", "line", "gauge", "scatter"],
        },
        {
          header: "Chart X Axis",
          component: "ChartXaxis",
          updateEvent: "chartXaxis",
          optionObject: "xAxis",
          charts: ["bar", "line", "scatter"],
        },
        {
          header: "Chart Y Axis",
          component: "ChartYaxis",
          updateEvent: "chartYaxis",
          optionObject: "yAxis",
          charts: ["bar", "line", "scatter"],
        },
      ],
      options: {},
    };
  },
  components: {
    ChartTitle: defineAsyncComponent(() => import("./ChartTitle.vue")),
    ChartLegend: defineAsyncComponent(() => import("./ChartLegend.vue")),
    ChartToolTip: defineAsyncComponent(() => import("./ChartToolTip.vue")),
    ChartAxisPointer: defineAsyncComponent(() =>
      import("./ChartAxisPointer.vue")
    ),
    ChartXaxis: defineAsyncComponent(() => import("./ChartXaxis.vue")),
    ChartYaxis: defineAsyncComponent(() => import("./ChartYaxis.vue")),
  },
  methods: {
    externalSettings(setting) {
      this.options[setting.name] = setting.value;
      this.$emit("generalSettings", this.options);
    },
  },
  created() {
    this.expandSettings = [...Array(this.settings.length).keys()].map(
      (k, i) => i
    );
    setTimeout(() => {
      this.expandSettings = [];
    }, 500);
  },
};
</script>
