<template>
  <v-row>
    <v-col cols="12">
      <v-switch
        color="blue"
        label="Show/Hide"
        v-model="label.show"
        @change="updated"
      >
        <v-tooltip activator="parent" location="bottom"
          >Whether to show labels</v-tooltip
        >
      </v-switch>
    </v-col>
    <v-col cols="12">
      <v-select
        :items="positions"
        v-model="label.position"
        label="Position"
        @change="updated"
      ></v-select>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="label.rotate"
        type="number"
        label="Rotate"
        min="-90"
        max="90"
        @input="updated"
      >
        <v-tooltip activator="parent" location="bottom"
          >Rotate label, from -90 degree to 90, positive value represents rotate
          anti-clockwise</v-tooltip
        >
      </v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="labelXOffset"
        type="number"
        label="Horizontal Offset"
        min="-90"
        max="90"
        @input="labelOffset"
      >
        <v-tooltip activator="parent" location="bottom"
          >Whether to move text slightly horizontally</v-tooltip
        >
      </v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="labelYOffset"
        type="number"
        label="Vertical Offset"
        min="-90"
        max="90"
        @input="labelOffset"
      >
        <v-tooltip activator="parent" location="bottom"
          >Whether to move text slightly vertically</v-tooltip
        >
      </v-text-field>
    </v-col>
    <v-col cols="12">
      <TextStyle @textStyle="LabelTextStyle" :values="label" />
    </v-col>
  </v-row>
</template>
<script>
import TextStyle from "./TextStyle.vue";
export default {
  props: ["subscriber", "default"],
  data() {
    return {
      label: {
        show: true,
        rotate: 0,
        offset: [0, 0],
        position: "top",
      },
      positions: [
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
      ],
    };
  },
  created() {
    this.labelXOffset = this.label.offset[0];
    this.labelYOffset = this.label.offset[1];
    if (this.default) {
      const labelSetProp = Object.keys(this.label);
      for (const def in this.default) {
        if (labelSetProp.includes(def)) {
          this.label[def] = this.default[def];
        }
      }
    }
    this.updated();
  },
  methods: {
    updated() {
      this.$emit(this.subscriber, this.label);
    },
    LabelTextStyle(setting) {
      for (const style in setting.value) {
        this.label[style] = setting.value[style];
      }
      this.updated();
    },
    labelOffset() {
      this.label.offset = [this.labelXOffset, this.labelYOffset];
      this.updated();
    },
  },
  components: {
    TextStyle,
  },
};
</script>
