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
              v-bind="{
                values: options[set.optionObject],
              }"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
  </div>
</template>
<script>
import { defineAsyncComponent, ref, onMounted } from "vue";
export default {
  props: ["chartType", "chartSubType", "option"],
  setup(props, context) {
    const expandSettings = ref([]);
    const settings = ref([
      {
        header: "Chart Toolbox",
        component: "ChartToolbox",
        updateEvent: "chartToolbox",
        optionObject: "toolbox",
        charts: ["bar", "pie", "line", "gauge", "scatter"],
      },
      {
        header: "Chart Title",
        component: "ChartTitle",
        updateEvent: "chartTitle",
        optionObject: "title",
        charts: ["bar", "pie", "line", "gauge", "scatter", "tabular"],
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
    ]);
    const options = ref({});

    function externalSettings(setting) {
      options.value[setting.name] = setting.value;
      context.emit("generalSettings", options.value);
    }

    onMounted(() => {
      options.value = JSON.parse(JSON.stringify(props.option));
      expandSettings.value = [...Array(settings.value.length).keys()].map(
        (k, i) => i
      );
      setTimeout(() => {
        expandSettings.value = [];
      }, 500);
    });

    return {
      expandSettings,
      settings,
      options,
      externalSettings,
    };
  },
  components: {
    ChartToolbox: defineAsyncComponent(() => import("./ChartToolbox.vue")),
    ChartTitle: defineAsyncComponent(() => import("./ChartTitle.vue")),
    ChartLegend: defineAsyncComponent(() => import("./ChartLegend.vue")),
    ChartToolTip: defineAsyncComponent(() => import("./ChartToolTip.vue")),
    ChartAxisPointer: defineAsyncComponent(() =>
      import("./ChartAxisPointer.vue")
    ),
    ChartXaxis: defineAsyncComponent(() => import("./ChartXaxis.vue")),
    ChartYaxis: defineAsyncComponent(() => import("./ChartYaxis.vue")),
  },
};
</script>
