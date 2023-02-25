<template>
  <div>
    <v-expansion-panels multiple focusable v-model="expandSettings">
      <v-expansion-panel title="Bar Chart" v-if="chartType === 'bar'">
        <v-expansion-panel-text>
          <BarChart @chartSettings="chartSettings" :options="options" />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Pie Chart" v-else-if="chartType === 'pie'">
        <v-expansion-panel-text>
          <PieChart
            @chartSettings="chartSettings"
            :chartSubType="chartSubType"
            :options="options"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Line Chart" v-else-if="chartType === 'line'">
        <v-expansion-panel-text>
          <LineChart
            @chartSettings="chartSettings"
            :chartSubType="chartSubType"
            :options="options"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Gauge Chart" v-else-if="chartType === 'gauge'">
        <v-expansion-panel-text>
          <GaugeChart @chartSettings="chartSettings" :options="options" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
export default {
  props: ["chartType", "chartSubType", "options"],
  data() {
    return {
      expandSettings: [],
    };
  },
  components: {
    BarChart: defineAsyncComponent(() => import("./Charts/BarChart.vue")),
    PieChart: defineAsyncComponent(() => import("./Charts/PieChart.vue")),
    LineChart: defineAsyncComponent(() => import("./Charts/LineChart.vue")),
    GaugeChart: defineAsyncComponent(() => import("./Charts/GaugeChart.vue")),
  },
  methods: {
    chartSettings(setting) {
      this.$emit("chartSettings", setting);
    },
  },
  created() {
    this.expandSettings = [0];
    setTimeout(() => {
      this.expandSettings = [];
    }, 500);
  },
};
</script>
