<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-switch
          color="blue"
          label="Show/Hide"
          v-model="toolbox.show"
          @change="updated"
        ></v-switch>
        <v-switch
          color="blue"
          label="Data View"
          v-model="toolbox.feature.dataView.show"
          @change="updated"
        ></v-switch>
        <v-switch
          color="blue"
          label="Read Only Data"
          v-model="toolbox.feature.dataView.readOnly"
          @change="updated"
        ></v-switch>
        <v-switch
          color="blue"
          label="Save Visualization"
          v-model="toolbox.feature.saveAsImage.show"
          @change="updated"
        ></v-switch>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: ["values"],
  data() {
    return {
      toolbox: {
        show: true,
        feature: {
          dataView: {
            show: true,
            readOnly: true,
          },
          magicType: { type: ["line", "bar"] },
          restore: {},
          saveAsImage: {
            show: true,
          },
        },
      },
    };
  },
  methods: {
    updated() {
      this.$emit("chartToolbox", { name: "toolbox", value: this.toolbox });
    },
  },
  created() {
    for (const index in this.values) {
      this.toolbox[index] = this.values[index];
    }
    this.updated();
  },
};
</script>
