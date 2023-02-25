<template>
  <v-container grid-list-xs> </v-container>
</template>
<script>
export default {
  props: { chartSubType: String, options: Object },
  data() {
    return {
      settings: {
        elements: [
          {
            type: "text",
            left: "center",
            top: 140,
            style: {
              text: "",
              fontSize: 40,
              fontWeight: "bold",
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: "transparent",
              stroke: "#000",
              lineWidth: 1,
            },
            keyframeAnimation: {
              duration: 3000,
              loop: false,
              keyframes: [
                {
                  percent: 0.7,
                  style: {
                    fill: "transparent",
                    lineDashOffset: 200,
                    lineDash: [200, 0],
                  },
                },
                {
                  // Stop for a while.
                  percent: 0.8,
                  style: {
                    fill: "transparent",
                  },
                },
                {
                  percent: 1,
                  style: {
                    fill: "black",
                  },
                },
              ],
            },
          },
          {
            type: "text",
            left: "center",
            top: 200,
            style: {
              text: "Total Staffs",
              fontSize: 30,
              fontWeight: "bold",
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: "transparent",
              stroke: "#000",
              lineWidth: 1,
            },
            keyframeAnimation: {
              duration: 3000,
              loop: false,
              keyframes: [
                {
                  percent: 0.7,
                  style: {
                    fill: "transparent",
                    lineDashOffset: 200,
                    lineDash: [200, 0],
                  },
                },
                {
                  // Stop for a while.
                  percent: 0.8,
                  style: {
                    fill: "transparent",
                  },
                },
                {
                  percent: 1,
                  style: {
                    fill: "black",
                  },
                },
              ],
            },
          },
        ],
      },
    };
  },
  created() {
    this.updated();
  },
  methods: {
    updated() {
      this.$emit("chartMetric", { name: "graphic", value: this.settings });
    },
  },
};
</script>
