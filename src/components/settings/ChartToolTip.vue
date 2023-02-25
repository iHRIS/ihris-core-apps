<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-switch
          label="Show/Hide"
          v-model="tooltip.show"
          @change="updated"
          color="blue"
        ></v-switch>
        <v-select
          :items="triggers"
          v-model="tooltip.trigger"
          label="Type of triggering"
          @change="updated"
        ></v-select>
        <v-select
          :items="triggerOn"
          v-model="tooltip.triggerOn"
          label="Type of triggering"
          @change="updated"
        ></v-select>
        <v-select
          :items="order"
          v-model="tooltip.order"
          label="Tooltip Order"
          item-title="name"
          item-value="value"
          @change="updated"
        ></v-select>
        <v-switch
          color="blue"
          label="Show Floating Layer"
          v-model="tooltip.showContent"
          @change="updated"
        ></v-switch>
        <v-switch
          color="blue"
          label="Always Show Content"
          v-model="tooltip.alwaysShowContent"
          @change="updated"
        ></v-switch>
        <v-expansion-panels multiple focusable v-model="expandSettings">
          <v-expansion-panel>
            <v-expansion-panel-title
              >Chart Axis Pointer</v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <ChartAxisPointer
                @chartAxisPointer="externalSettings"
                :values="tooltip.axisPointer"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>Text Style</v-expansion-panel-title>
            <v-expansion-panel-text>
              <TextStyle @textStyle="textStyle" :values="tooltip.textStyle" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import ChartAxisPointer from "./ChartAxisPointer.vue";
import TextStyle from "./TextStyle.vue";
export default {
  props: ["values"],
  data() {
    return {
      tooltip: {
        show: true,
        showContent: true,
        alwaysShowContent: false,
        position: function (pt) {
          return [pt[0], 130];
        },
        trigger: "item",
        triggerOn: "mousemove|click",
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
        textStyle: {},
        order: "seriesAsc",
      },
      triggers: ["item", "axis", "none"],
      triggerOn: ["mousemove", "click", "mousemove|click", "none"],
      order: [
        { name: "Ascending Order, based on series", value: "seriesAsc" },
        { name: "Descending Order, based on series", value: "seriesDesc" },
        { name: "Ascending Order, based on values", value: "valueAsc" },
        { name: "Ascending Order, based on values", value: "valueDesc" },
      ],
      expandSettings: [],
    };
  },
  methods: {
    externalSettings(setting) {
      this.tooltip[setting.name] = setting.value;
      this.updated();
    },
    textStyle(setting) {
      this.tooltip[setting.name] = setting.value;
      this.updated();
    },
    updated() {
      this.$emit("chartTooltip", { name: "tooltip", value: this.tooltip });
    },
  },
  components: {
    ChartAxisPointer,
    TextStyle,
  },
  created() {
    for (const index in this.values) {
      this.tooltip[index] = this.values[index];
    }
    this.expandSettings = [0, 1];
    setTimeout(() => {
      this.expandSettings = [];
    }, 500);
  },
};
</script>
