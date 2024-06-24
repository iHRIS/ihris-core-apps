<template>
  <div>
    <v-expansion-panels multiple focusable v-model="expandSettings">
      <v-expansion-panel title="Bar Chart" v-if="chartType === 'bar'">
        <v-expansion-panel-text>
          <BarChart @chartSettings="chartSettings" :option="options" />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Pie Chart" v-else-if="chartType === 'pie'">
        <v-expansion-panel-text>
          <PieChart
            @chartSettings="chartSettings"
            :chartSubType="chartSubType"
            :option="options"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Line Chart" v-else-if="chartType === 'line'">
        <v-expansion-panel-text>
          <LineChart
            @chartSettings="chartSettings"
            :chartSubType="chartSubType"
            :option="options"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Gauge Chart" v-else-if="chartType === 'gauge'">
        <v-expansion-panel-text>
          <GaugeChart @chartSettings="chartSettings" :option="options" />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel
        title="Metric Chart"
        v-else-if="chartType === 'metric'"
      >
        <v-expansion-panel-text>
          <MetricChart
            @chartSettings="chartSettings"
            v-model:option="options"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import { defineAsyncComponent, ref, computed, onMounted } from "vue";
export default {
  props: ["chartType", "chartSubType", "option"],
  setup(props, context) {
    const expandSettings = ref([]);
    const options = computed({
      get() {
        return props.option;
      },
      set(value) {
        context.emit("update:option", value);
      },
    });
    function chartSettings(setting) {
      context.emit("chartSettings", setting);
    }
    onMounted(() => {
      expandSettings.value = [0];
      setTimeout(() => {
        expandSettings.value = [];
      }, 500);
    });

    return {
      options,
      expandSettings,
      chartSettings,
    };
  },
  components: {
    BarChart: defineAsyncComponent(() => import("./Charts/BarChart.vue")),
    PieChart: defineAsyncComponent(() => import("./Charts/PieChart.vue")),
    LineChart: defineAsyncComponent(() => import("./Charts/LineChart.vue")),
    GaugeChart: defineAsyncComponent(() => import("./Charts/GaugeChart.vue")),
    MetricChart: defineAsyncComponent(() => import("./Charts/MetricChart.vue")),
  },
};
</script>
