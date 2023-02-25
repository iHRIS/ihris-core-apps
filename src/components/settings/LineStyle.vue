<template>
  <div>
    <v-dialog v-model="displayColor" width="313px">
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="lineStyle.color"
      ></v-color-picker>
    </v-dialog>
    <v-row>
      <v-col cols="6"> Color: </v-col>
      <v-col cols="6">
        <v-card
          :color="lineStyle.color"
          width="30px"
          height="20"
          @click="displayColor = true"
        >
          <v-card-text @click="displayColor = true"> </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="lineStyle.width"
          type="number"
          label="Line width"
          min="0"
          max="400"
          @input="updated"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-select
          :items="axisLineTypes"
          v-model="lineStyle.type"
          label="Line type"
          @change="updated"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-select
          :items="caps"
          v-model="lineStyle.cap"
          label="How to draw the end points of the line"
          @change="updated"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="lineStyle.opacity"
          type="number"
          label="Line Opacity"
          min="0.0"
          max="1"
          @input="updated"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: ["subscriber", "values"],
  data() {
    return {
      displayColor: false,
      lineStyle: {
        color: "#333",
        width: 1,
        type: "solid",
        cap: "butt",
        opacity: 1,
      },
      axisLineTypes: ["solid", "dashed", "dotted"],
      caps: ["butt", "round", "square"],
    };
  },
  watch: {
    "lineStyle.color": function (val, oldVal) {
      if (val !== oldVal) {
        this.updated();
      }
    },
  },
  methods: {
    updated() {
      this.$emit(this.subscriber, { name: "lineStyle", value: this.lineStyle });
    },
  },
  created() {
    for (const index in this.values) {
      if (Object.keys(this.lineStyle).indexOf(index) !== -1) {
        this.lineStyle[index] = this.values[index];
      }
    }
  },
};
</script>
